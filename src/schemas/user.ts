import * as mongoose from 'mongoose';

export interface IMember extends mongoose.Document {
    userid: string;
    username: string;
    experience: number;
    messageCount: number;
    level: number;
};

export const MemberSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    username: { type: String, required: true },
    experience: { type: String, required: true },
    messageCount: { type: Number, required: true },
    level: { type: Number, required: true },
});

const DMember = mongoose.model<IMember>('Member', MemberSchema);
export default DMember;