import { STRINGS } from './constants';

const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME || STRINGS.DEFAULT_PROJECT_NAME;
const COURSE_NAME = process.env.REACT_APP_COURSE_NAME || STRINGS.DEFAULT_COURSE_NAME;

// The wordmark is the first word of the official name ("FPV"); the rest is
// the descriptor set beneath it ("Tədris Alt Sistemi").
const [PROJECT_MARK, ...descriptorWords] = PROJECT_NAME.trim().split(/\s+/);
const PROJECT_DESCRIPTOR = descriptorWords.join(" ");

export const BRAND = {
  PROJECT_NAME,
  PROJECT_MARK,
  PROJECT_DESCRIPTOR,
  COURSE_NAME,
};
