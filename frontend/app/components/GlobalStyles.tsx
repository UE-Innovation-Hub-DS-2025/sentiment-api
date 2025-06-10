"use client";

const styles = `
  @keyframes highlight {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.2); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }

  .highlight-section {
    animation: highlight 2s ease-out;
  }
`;

export default function GlobalStyles() {
  return (
    <style jsx global>
      {styles}
    </style>
  );
}
