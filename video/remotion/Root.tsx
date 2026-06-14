import { Composition } from 'remotion';

import {
  EduRydayFinalDemo,
  VIDEO_DURATION_SECONDS,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from './EduRydayFinalDemo';
import {
  EduRydaySubmissionDemo,
  SUBMISSION_VIDEO_DURATION_SECONDS,
  SUBMISSION_VIDEO_FPS,
  SUBMISSION_VIDEO_HEIGHT,
  SUBMISSION_VIDEO_WIDTH,
} from './EduRydaySubmissionDemo';
import {
  EduRydayProductDemo,
  PRODUCT_VIDEO_DURATION_SECONDS,
  PRODUCT_VIDEO_FPS,
  PRODUCT_VIDEO_HEIGHT,
  PRODUCT_VIDEO_WIDTH,
} from './EduRydayProductDemo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="EduRydayProductDemo"
        component={EduRydayProductDemo}
        durationInFrames={PRODUCT_VIDEO_DURATION_SECONDS * PRODUCT_VIDEO_FPS}
        fps={PRODUCT_VIDEO_FPS}
        height={PRODUCT_VIDEO_HEIGHT}
        width={PRODUCT_VIDEO_WIDTH}
      />
      <Composition
        id="EduRydaySubmissionDemo"
        component={EduRydaySubmissionDemo}
        durationInFrames={SUBMISSION_VIDEO_DURATION_SECONDS * SUBMISSION_VIDEO_FPS}
        fps={SUBMISSION_VIDEO_FPS}
        height={SUBMISSION_VIDEO_HEIGHT}
        width={SUBMISSION_VIDEO_WIDTH}
      />
      <Composition
        id="EduRydayFinalDemo"
        component={EduRydayFinalDemo}
        durationInFrames={VIDEO_DURATION_SECONDS * VIDEO_FPS}
        fps={VIDEO_FPS}
        height={VIDEO_HEIGHT}
        width={VIDEO_WIDTH}
      />
    </>
  );
};
