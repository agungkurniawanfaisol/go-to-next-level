/** Langkah pipeline CNN — dipakai saat scanning & hasil appraisal (demo juri). */

export type CNNPipelineStep = {
  id: string;
  label: string;
  technical: string;
};

export const CNN_PIPELINE_STEPS: CNNPipelineStep[] = [
  {
    id: "input",
    label: "Image Input",
    technical: "Resize 224×224 · normalisasi RGB",
  },
  {
    id: "conv1",
    label: "Conv Block 1",
    technical: "Conv2D(64) · ReLU · MaxPool",
  },
  {
    id: "conv2",
    label: "Conv Block 2",
    technical: "Conv2D(128) · ReLU · MaxPool",
  },
  {
    id: "features",
    label: "Feature Extraction",
    technical: "Flatten · Dense(256)",
  },
  {
    id: "classify",
    label: "Role Classification",
    technical: "Softmax · heritage vs umum",
  },
  {
    id: "appraisal",
    label: "Automated Appraisal",
    technical: "Confidence · kondisi · EcoSwap Points",
  },
];

export const CNN_MODEL_NAME = "EcoSwap-Heritage-CNN v1.2";

export type CNNClassPrediction = {
  label: string;
  probability: number;
};
