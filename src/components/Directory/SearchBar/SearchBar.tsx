import { CloudUpload, Search } from "@mui/icons-material";
import { Button, Grid, styled, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { useFiles } from "../../../context/FileContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function SearchBar() {
  const { uploadFiles, setSearchQuery, loading, searchFiles } = useFiles();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      await uploadFiles(files);
    }
  };

  const handleSearch = () => {
    searchFiles(); // 🔥 Manually trigger search when clicking the button
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ sm: 3, xs: 4 }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          fullWidth
          tabIndex={-1}
          startIcon={<CloudUpload />}
          sx={{ height: "56px" }}
        >
          Upload
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
      </Grid>
      <Grid
        size={{ sm: 9, xs: 8 }}
        display={"flex"}
        flexDirection={"row"}
        gap={3}
      >
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          placeholder="Search for file name, type, content..."
          type="search"
          slotProps={{ inputLabel: { shrink: true } }}
          disabled={loading}
          onChange={(e) => setSearchQuery(e.target.value)}
          helperText="Search for content only works for types: .txt, .md, .csv, .json, .log, .rtf"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchFiles(); // 🔥 Search only on Enter key press
            }
          }}
        />
        <Button
          sx={{ height: "56px" }}
          variant="contained"
          loading={loading}
          onClick={handleSearch}
        >
          <Search />
        </Button>
      </Grid>
    </Grid>
  );
}

export default SearchBar;
