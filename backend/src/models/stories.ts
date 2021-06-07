import { Schema, model, Document } from 'mongoose'

export type IStory = Document

export const storySchema: Schema<IStory> = new Schema(
    {
        // story details
        // story creator
    },
    {
        timestamps: true,
    }
)

const Story = model<IStory>('Story', storySchema)
export default Story
