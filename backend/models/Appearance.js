const mongoose = require('mongoose');

const appearanceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  layout: {
    type: String,
    default: 'stack'
  },
  buttonStyle: {
    type: String,
    default: 'fill'
  },
  buttonColor: {
    type: String,
    default: '#111111'
  },
  buttonFontColor: {
    type: String,
    default: '#ffffff'
  },
  font: {
    type: String,
    default: 'DM Sans'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  theme: {
    type: String,
    default: 'air-snow'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appearance', appearanceSchema);