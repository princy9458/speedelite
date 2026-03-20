export type ApplicationFieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "select"
  | "checkbox-group"
  | "file"
  | "checkbox";

export type ApplicationFieldId =
  | "firstName"
  | "lastName"
  | "email"
  | "mobile"
  | "dob"
  | "residence"
  | "education"
  | "occupation"
  | "height"
  | "children"
  | "interests"
  | "short_desc"
  | "smoker"
  | "exercise"
  | "languages"
  | "looking_for"
  | "sleeping_habits"
  | "outings"
  | "facePhoto"
  | "bodyPhoto"
  | "termsAgreement";

export type ApplicationFieldConfig = {
  id: ApplicationFieldId;
  type: ApplicationFieldType;
  required?: boolean;
  accept?: string[];
};

export const applicationFormFields: ApplicationFieldConfig[] = [
  { id: "firstName", type: "text", required: true },
  { id: "lastName", type: "text", required: true },
  { id: "email", type: "email", required: true },
  { id: "mobile", type: "tel", required: true },
  { id: "dob", type: "date", required: true },
  { id: "residence", type: "text", required: true },
  { id: "education", type: "select", required: true },
  { id: "occupation", type: "text", required: true },
  { id: "height", type: "text", required: true },
  { id: "children", type: "select", required: true },
  { id: "interests", type: "checkbox-group" },
  { id: "short_desc", type: "textarea", required: true },
  { id: "smoker", type: "select", required: true },
  { id: "exercise", type: "select", required: true },
  { id: "languages", type: "select", required: true },
  { id: "looking_for", type: "select", required: true },
  { id: "sleeping_habits", type: "select", required: true },
  { id: "outings", type: "select", required: true },
  { id: "facePhoto", type: "file", required: true, accept: ["image/png", "image/jpeg"] },
  { id: "bodyPhoto", type: "file", required: true, accept: ["image/png", "image/jpeg"] },
  { id: "termsAgreement", type: "checkbox", required: true },
];
