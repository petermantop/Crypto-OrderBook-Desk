import React, { useState } from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Button,
} from "@mui/material";

export default function SelectCyptoPair({
  cryptoPairs = [{ id: 1, symbol: "BIT-USDT" }],
  onPairChange,
}) {
  const [selectedPair, setSelectedPair] = useState(cryptoPairs[0].id); // Default to the first pair

  const handleSubscribe = () => {
    if (onPairChange) {
      onPairChange(selectedPair);
    }
  };

  const handlePairChange = (event) => {
    const newPair = event.target.value;
    setSelectedPair(newPair);
    if (onPairChange) {
      onPairChange(newPair);
    }
  };
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      marginBottom={2}
    >
      <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
        <InputLabel id="crypto-pair-select-label">Pair</InputLabel>
        <Select
          labelId="crypto-pair-select-label"
          id="crypto-pair-select"
          value={selectedPair}
          label="Pair"
          onChange={handlePairChange}
          size="small"
        >
          {cryptoPairs.map((pair) => (
            <MenuItem key={pair.id} value={pair.id}>
              {pair.symbol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubscribe}>
        Subscribe
      </Button>
    </Box>
  );
}
