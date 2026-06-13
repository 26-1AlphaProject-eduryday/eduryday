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

export const RemotionRoot = () => {
  return (
    <>
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
