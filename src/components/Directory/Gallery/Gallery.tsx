import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { FileItem, useFiles } from "../../../context/FileContext";
import { useCallback } from "react";

function Gallery() {
  const { files, error, downloadFile, deleteFile } = useFiles();

  const mediaImage = useCallback((file: FileItem) => {
    if (["txt", "md", "csv", "json", "log", "rtf"].includes(file.type)) {
      return "/image-placeholder.png";
    }

    return file.url;
  }, []);

  return (
    <Grid container spacing={3}>
      {error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {files.length === 0 ? (
        <Grid size={12}>
          <Alert severity="info">No files found.</Alert>
        </Grid>
      ) : (
        files.map((file, index) => (
          <Grid
            size={{ xs: 6, sm: 6, md: 4, lg: 3 }}
            key={index}
            display={"flex"}
            height={350}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                ":hover": {
                  border: "1px solid",
                  borderColor: "primary.main",
                  cursor: "pointer",
                  "& .delete-btn": {
                    display: "flex",
                  },
                },
              }}
            >
              <CardMedia
                image={mediaImage(file)}
                title={file.name}
                sx={{ height: 140 }}
                onClick={() => window.open(file.url, "_blank")}
              />
              <CardContent
                sx={{ flexGrow: 1 }}
                onClick={() => window.open(file.url, "_blank")}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, // Limits to 2 lines
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                  }}
                  title={file.name}
                >
                  {file.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Type: </strong>
                  {file.type}
                </Typography>
              </CardContent>
              <CardActions>
                <Grid container spacing={1} sx={{ width: "100%" }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      href={file.url}
                      target="_blank"
                    >
                      View
                    </Button>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      onClick={() => downloadFile(file)}
                    >
                      Download
                    </Button>
                  </Grid>
                  <Grid
                    size={12}
                    className="delete-btn"
                    sx={{ display: "none" }}
                  >
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => deleteFile(file.id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default Gallery;
