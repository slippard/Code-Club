import * as mongoose from 'mongoose';

interface projectDetails {
    name: string;
    description: string;
    owner: string;
    star: number;
    git: string;
}

export interface IMember extends mongoose.Document {
    userid: string;
    username: string;
    experience: number;
    messageCount: number;
    currentLevel: number;
    nextLevel: number;
    projects: Array<projectDetails>;
};

export const MemberSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    username: { type: String, required: true },
    experience: { type: String, required: true },
    messageCount: { type: Number, required: true },
    currentLevel: { type: Number, required: true },
    nextLevel: { type: Number, required: true },
    projects: { type: Array, required: true },
});

const DMember = mongoose.model<IMember>('Member', MemberSchema);
export default DMember;