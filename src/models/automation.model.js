import mongoose, { Schema } from "mongoose";

const automationSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    isActive: {
        type: Boolean,
        default: true
    },
    conditions: [{
        deviceId: {
            type: String,
            required: true
        },
        parameter: {
            type: String,
            required: true
        },
        operator: {
            type: String,
            enum: ['>', '<', '>=', '<=', '==', '!=', 'contains', 'not_contains'],
            required: true
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        logicalOperator: {
            type: String,
            enum: ['AND', 'OR'],
            default: 'AND'
        }
    }],
    actions: [{
        type: {
            type: String,
            enum: ['email', 'sms', 'webhook', 'device_command', 'notification'],
            required: true
        },
        target: {
            type: String,
            required: true
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        delay: {
            type: Number,
            default: 0
        }
    }],
    schedule: {
        enabled: {
            type: Boolean,
            default: false
        },
        startTime: String,
        endTime: String,
        days: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }]
    },
    cooldown: {
        type: Number,
        default: 300 // 5 minutes in seconds
    },
    lastTriggered: Date,
    triggerCount: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export const Automation = mongoose.model("Automation" , automationSchema)