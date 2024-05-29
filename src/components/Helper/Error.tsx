import React from "react";

const styles: React.CSSProperties = {
  color: 'var(--gray-300)',
  fontSize: '0.825rem',
};

const Error = ({ message }: { message: string }) => {
  return <p style={styles}>{message}</p>;
};

export default Error;
