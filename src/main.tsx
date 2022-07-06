import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";

const Main = () => {
  const [text, setText] = useState("Hello");
  useEffect(() => {
    const timer = setTimeout(() => setText("Hello John! xD"), 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <Text color="green">{text}</Text>
    </Box>
  );
};

render(<Main />);
