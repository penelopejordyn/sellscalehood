from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)
    
class Stocks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False)
    shortName = db.Column(db.String(100), nullable=False)
    currentPrice = db.Column(db.Float, nullable=False)
    tracking = db.Column(db.Boolean, nullable=False)
    owned = db.Column(db.Boolean, default=False)
    shares = db.Column(db.Float, nullable=True)
    
class TradeHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False)
    shortName = db.Column(db.String(100), nullable=False)
    shares = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    action = db.Column(db.String(10), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)


    
    