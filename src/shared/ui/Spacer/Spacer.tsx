type SpacerProps = {
  height?: number;
};

export function Spacer({ height = 20 }: SpacerProps) {
  return <div style={{ height: `${height}px` }} />;
}

