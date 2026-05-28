import React from "react";
import { Composition } from "remotion";
import { ConicalPendulum } from "./conical-pendulum/ConicalPendulum";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ConicalPendulum"
      component={ConicalPendulum}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
