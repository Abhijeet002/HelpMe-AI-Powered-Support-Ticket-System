import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    senderRole: {
      type: String,
      enum: ['user', 'agent', 'admin'],
      required: true
    }
  },
  { timestamps: true }
);

export const Reply = mongoose.model('Reply', replySchema);
