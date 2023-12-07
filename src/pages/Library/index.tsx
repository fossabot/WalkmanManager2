import { Add } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  TextField,
} from "@mui/material";
import { FC, useContext, useMemo, useState } from "react";
import SongsView from "./SongsView";
import { libraryContext } from "@/contexts/LibraryContextProvider";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import Fuse from "fuse.js";

const LibraryPage: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { songs } = useContext(libraryContext);
  const { t } = useTranslation("common");
  const [searchKeyword, setSearchKeyword] = useState("");

  const fuse = useMemo(
    () => new Fuse(songs, { includeScore: true, keys: ["title", "album", "artist"] }),
    [songs],
  );
  const searchResult = useMemo(() => {
    if (searchKeyword === "") {
      return songs;
    }
    const res = fuse.search(searchKeyword);
    return res.map((item) => item.item);
  }, [searchKeyword, fuse]);

  function selectAllMedia() {
    setSelectedIndex(-1);
  }

  return (
    <Box className="h-full flex">
      <Box
        component="aside"
        sx={{ borderColor: "divider" }}
        className="flex-none h-full w-[250px] border-r"
      >
        <List>
          <ListSubheader>Your Library</ListSubheader>
          <ListItem disablePadding>
            <ListItemButton selected={selectedIndex === -1} onClick={selectAllMedia}>
              All Media
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListSubheader>
            <div className="flex justify-between align-center">
              <span>Playlists</span>
              <span>
                <IconButton className="aspect-square" size="small" style={{ flex: "none" }}>
                  <Add fontSize="small" />
                </IconButton>
              </span>
            </div>
          </ListSubheader>
          <Divider />
        </List>
      </Box>

      <Box className="flex-auto w-full flex flex-col">
        <Box className="flex items-center border-b pl-4" sx={{ borderColor: "grey.700" }}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            value={searchKeyword}
            className="py-2"
            placeholder={t("search")}
            variant="standard"
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </Box>

        <Box className="flex-auto">
          <SongsView songs={searchResult} />
        </Box>
      </Box>
    </Box>
  );
};

export default LibraryPage;
