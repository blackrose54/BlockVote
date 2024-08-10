"use client";

import React, { FC, ReactElement, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./Input";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}): ReactElement => {
  const [search, setsearch] = useState<string>("");
  return (
   
      <Input
        placeholders={["Search Election Id","Create new Election"]}
        onChange={(e) => setsearch(e.target.value)}
        onSubmit={(val) => console.log(search)}
        
      />
  );
};

export default SearchBar;
