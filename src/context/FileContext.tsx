import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

export interface FileItem {
  name: string;
  url: string;
  type: string;
  id: string;
}

interface FileContextType {
  files: FileItem[];
  error: string | null;
  refreshFiles: () => Promise<void>;
  searchFiles: () => Promise<void>; // 🔥 New function to trigger search
  downloadFile: (file: FileItem) => Promise<void>;
  uploadFiles: (files: FileList) => Promise<void>;
  deleteFile: (fileName: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      refreshFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUploadedFiles = async (
    query: string = ""
  ): Promise<FileItem[]> => {
    try {
      const url = query
        ? `http://localhost:5050/files?search=${query}`
        : "http://localhost:5050/files";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const fileNames: string[] = await response.json();

      return fileNames.map((fullName) => {
        const firstDashIndex = fullName.indexOf("-");

        const prefix =
          firstDashIndex !== -1 ? fullName.slice(0, firstDashIndex) : "";
        const cleanName =
          firstDashIndex !== -1 ? fullName.slice(firstDashIndex + 1) : fullName;

        const nameParts = cleanName.split(".");
        const ext = nameParts.pop() || "unknown";

        return {
          id: prefix,
          name: nameParts.join("."),
          url: `http://localhost:5050/uploads/${fullName}`,
          type: ext.toLowerCase(),
        };
      });
    } catch (error) {
      console.error("Fetch error:", error);
      throw new Error("Failed to fetch uploaded files.");
    }
  };

  const refreshFiles = async () => {
    setLoading(true);
    try {
      const updatedFiles = await fetchUploadedFiles();
      setFiles(updatedFiles);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching files."
      );
    }
    setLoading(false);
  };

  const searchFiles = async () => {
    setLoading(true);
    try {
      const updatedFiles = await fetchUploadedFiles(searchQuery);
      setFiles(updatedFiles);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while searching files."
      );
    }
    setLoading(false);
  };

  const downloadFile = async (file: FileItem) => {
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const uploadFiles = async (fileList: FileList) => {
    if (!fileList || fileList.length === 0) return;

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("http://localhost:5050/upload", {
        method: "POST",
        body: formData,
      });

      // ✅ Handle HTTP errors manually
      if (!response.ok) {
        const errorData = await response.json(); // Try to get error message from server
        throw new Error(
          errorData.error || `Upload failed with status ${response.status}`
        );
      }

      // ✅ Only refresh files if the upload was successful
      await refreshFiles();
    } catch (err) {
      console.error("Upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while uploading files."
      );
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`http://localhost:5050/delete/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Delete failed with status ${response.status}`
        );
      }

      // ✅ Refresh file list after successful deletion
      await refreshFiles();
    } catch (err) {
      console.error("Delete failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while deleting the file."
      );
    }
  };

  return (
    <FileContext.Provider
      value={{
        files,
        error,
        refreshFiles,
        searchFiles,
        downloadFile,
        uploadFiles,
        deleteFile,
        searchQuery,
        setSearchQuery,
        loading,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};
