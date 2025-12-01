const React = require('react');

function Icon(props) {
  return React.createElement('svg', { 'data-testid': props['data-testid'] || 'icon', ...props });
}

module.exports = {
  Users: Icon,
  ShirtIcon: Icon,
  Music2: Icon,
  UtensilsCrossed: Icon,
  CheckCircle2: Icon,
  MessageSquare: Icon,
  // fallback default export
  default: Icon,
};
