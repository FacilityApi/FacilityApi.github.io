import React from 'react';

export default function Editor() {
  return (
    <iframe
      src="/editor-app"
      title="Facility Editor"
      style={{
        border: 0,
        display: 'block',
        height: 'calc(100vh - var(--ifm-navbar-height))',
        width: '100%',
      }}
    />
  );
}