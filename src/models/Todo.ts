import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  content?: string;  
  completed: boolean;
  userId: mongoose.Types.ObjectId;
}

const TodoSchema = new Schema(
  {
    title: { type: String, required: true },
   content: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);
