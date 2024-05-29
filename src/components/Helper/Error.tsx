import React from "react";

const styles: React.CSSProperties = {
  color: 'red',
};

const Error = ({ message }: { message: string }) => {
  return <p style={styles}>{message}</p>;
};

export default Error;
