import React from "react";

export const FormatMenuOption = {
  Bold: "Bold",
  Italic: "Italic",
  Underline: "Underline",
  StrikeThrough: "StrikeThrough",
  TextColor: "TextColor",
  Highlight: "Highlight",
  Size: "Size",
  NumberedList: "NumberedList",
  BulletList: "BulletList",
  IndentIncrease: "IndentIncrease",
  IndentDecrease: "IndentDecrease",
  Clear: "Clear",
};

export const EditorActionMap = {
  [FormatMenuOption.Bold]: { key: "BOLD", isBlockType: false },
  [FormatMenuOption.Italic]: { key: "ITALIC", isBlockType: false },
  [FormatMenuOption.Underline]: { key: "UNDERLINE", isBlockType: false },
  [FormatMenuOption.StrikeThrough]: {
    key: "STRIKETHROUGH",
    isBlockType: false,
  },
  [FormatMenuOption.TextColor]: { key: "COLOR_red", isBlockType: false },
  [FormatMenuOption.Highlight]: { key: "HIGHLIGHT", isBlockType: false },
  [FormatMenuOption.Size]: { key: "FONT_SIZE_30", isBlockType: false },
  [FormatMenuOption.NumberedList]: {
    key: "ordered-list-item",
    isBlockType: true,
  },
  [FormatMenuOption.BulletList]: {
    key: "unordered-list-item",
    isBlockType: true,
  },
  [FormatMenuOption.IndentIncrease]: {
    key: "indent-increase",
    isBlockType: true,
  },
  [FormatMenuOption.IndentDecrease]: {
    key: "indent-decrease",
    isBlockType: true,
  },
  [FormatMenuOption.Clear]: { key: "CLEAR", isBlockType: false },
};

export const FormattingMenu = ({ onPress, activeFormats }) => {
  const options = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.Bold),
      selected: activeFormats.includes(
        EditorActionMap[FormatMenuOption.Bold].key
      ),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.Italic),
      selected: activeFormats.includes(
        EditorActionMap[FormatMenuOption.Italic].key
      ),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.Underline),
      selected: activeFormats.includes(
        EditorActionMap[FormatMenuOption.Underline].key
      ),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <g>
            <rect fill="none" height="24" width="24" />
          </g>
          <g>
            <g>
              <g>
                <path d="M6.85,7.08C6.85,4.37,9.45,3,12.24,3c1.64,0,3,0.49,3.9,1.28c0.77,0.65,1.46,1.73,1.46,3.24h-3.01 c0-0.31-0.05-0.59-0.15-0.85c-0.29-0.86-1.2-1.28-2.25-1.28c-1.86,0-2.34,1.02-2.34,1.7c0,0.48,0.25,0.88,0.74,1.21 C10.97,8.55,11.36,8.78,12,9H7.39C7.18,8.66,6.85,8.11,6.85,7.08z M21,12v-2H3v2h9.62c1.15,0.45,1.96,0.75,1.96,1.97 c0,1-0.81,1.67-2.28,1.67c-1.54,0-2.93-0.54-2.93-2.51H6.4c0,0.55,0.08,1.13,0.24,1.58c0.81,2.29,3.29,3.3,5.67,3.3 c2.27,0,5.3-0.89,5.3-4.05c0-0.3-0.01-1.16-0.48-1.94H21V12z" />
              </g>
            </g>
          </g>
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.StrikeThrough),
      selected: activeFormats.includes(
        EditorActionMap[FormatMenuOption.StrikeThrough].key
      ),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
        >
          <path d="M19.08,19v2h-14V19Zm-.78-2.09H15.71l-.86-2.82,0-.18H9.34l-.06.18L8.4,16.91H5.91L10.68,3h2.9ZM14.19,12l-.11-.33L12.33,6.26l-.23-.73-.24.73L10.07,11.7,10,12h4.23Z" />
          <rect width="24" height="24" fill="none" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.TextColor),
      selected: false,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
        >
          <path d="M18.88,14.93v5.19H16.12v-4.3l-1.58-2.2H9.25L7.88,15.78v4.34H5.12V15l2.63-4.09H16ZM15,2.5l-6,5v2h6Z" />
          <rect width="24" height="24" fill="none" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.Highlight),
      selected: activeFormats.includes(
        EditorActionMap[FormatMenuOption.Highlight].key
      ),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.Size),
      selected: false,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.NumberedList),
      selected: false,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.BulletList),
      selected: false,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.IndentIncrease),
      selected: false,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.IndentDecrease),
      selected: false,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
        >
          <path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z" />
        </svg>
      ),
      onPress: () => onPress(FormatMenuOption.Clear),
      selected: false,
    },
  ];

  return (
    <div className="controls-buttons">
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={`controls-button-item ${
              option.selected ? "selected" : ""
            }`}
            onClick={option.onPress}
          >
            {option.icon}
          </div>
        );
      })}
    </div>
  );
};
