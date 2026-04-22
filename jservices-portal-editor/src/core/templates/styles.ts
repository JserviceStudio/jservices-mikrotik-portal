export const baseStyles = `
  :root {
    --primary: <%= branding.primaryColor %>;
    --secondary: <%= branding.secondaryColor %>;
    --font-family: <%= branding.fontFamily %>;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--font-family);
  }
  .hidden { display: none; }
  .input-error {
    border-color: #ef4444 !important;
    animation: shake 0.4s ease-in-out;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
