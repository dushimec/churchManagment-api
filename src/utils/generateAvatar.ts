
import axios from "axios";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateAvatar = async (name: string) => {
  try {
    const response = await axios.get(
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name
      )}&backgroundColor=${getRandomColor()}&textColor=${getRandomColor()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to generate avatar");
  }
};