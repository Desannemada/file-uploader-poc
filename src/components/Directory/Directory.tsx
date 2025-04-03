import { Box } from "@mui/material";
import SearchBar from "./SearchBar/SearchBar";
import Gallery from "./Gallery/Gallery";

function Directory() {
  return (
    <Box
      gap={5}
      display={"flex"}
      flexDirection={"column"}
      flexGrow={1}
      paddingBottom={"3rem"}
    >
      <SearchBar />
      <Gallery />
    </Box>
  );
}

export default Directory;
