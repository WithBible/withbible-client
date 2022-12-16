import React, { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";

//INTERNAL IMPORT
import { CHAPTER_SEARCH_URI, ACTIVE_CHAPTER_URI } from "../constants/api";

export const ChapterContext = React.createContext();

export const ChapterProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [chapterSearch, setChapterSearch] = useState([]);
  const [activeChapter, setActiveChapter] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchChapterSearch = async (searchKeyword) => {
    setSearchKeyword(searchKeyword);
    setError("");

    try {
      const { data } = await axios.get(
        `${CHAPTER_SEARCH_URI}?keyword=${searchKeyword}`
      );
      setChapterSearch(data.result);
    } catch (error) {
      const message = error.response.data.message;
      setError(message);
    }
  };

  const fetchActiveChapter = async () => {
    try {
      const { data } = await axios.get(ACTIVE_CHAPTER_URI);
      setActiveChapter(data.result);
    } catch (error) {
      const message = error.response.data.message;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <ChapterContext.Provider
      value={{
        chapterSearch,
        fetchChapterSearch,
        searchKeyword,
        setSearchKeyword,
        activeChapter,
        fetchActiveChapter,
        error,
      }}
    >
      {children}
    </ChapterContext.Provider>
  );
};
