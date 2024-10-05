from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS
from models import db, connect_db, Stocks, TradeHistory
import schedule
import time
from threading import Thread
from yfinance import Ticker

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sellscalehood'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

# Initialize the database
with app.app_context():
    connect_db(app)
    db.create_all()

@app.route("/stock_information", methods=["POST"])
def stock_information():
    """
    Fetch stock information for a given symbol.
    Expects JSON payload with 'symbol'.
    """
    data = request.json
    symbol = data.get('symbol')
    info = yf.Ticker(symbol).info
    print(f"Received data: {info},")
    return jsonify(info)

@app.route("/track", methods=["POST"])
def track():
    """
    Track a new stock.
    Expects JSON payload with 'symbol', 'shortName', and 'currentPrice'.
    """
    data = request.get_json()
    symbol = data.get('symbol')
    shortName = data.get('shortName')
    currentPrice = data.get('currentPrice')
    
    existing_stock = Stocks.query.filter_by(symbol=symbol, tracking=True).first()
    if existing_stock:
        return jsonify({"message": "Stock is already being tracked"}), 400

    new_stock = Stocks(symbol=symbol, shortName=shortName, currentPrice=currentPrice, tracking=True)
    
    try:
        db.session.add(new_stock)
        db.session.commit()
        print(new_stock)
        return jsonify({"message": "Stock added successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/tracked")
def tracked():
    """
    Get all tracked stocks.
    """
    tracked_stocks = Stocks.query.filter_by(tracking=True).all()
    return jsonify([{
        "symbol": stock.symbol,
        "shortName": stock.shortName,
        "currentPrice": stock.currentPrice
    } for stock in tracked_stocks])

@app.route("/is_tracked/<symbol>", methods=["GET"])
def is_tracked(symbol):
    """
    Check if a stock is being tracked.
    """
    stock = Stocks.query.filter_by(symbol=symbol, tracking=True).first()
    if stock:
        return jsonify({"tracked": True})
    return jsonify({"tracked": False})

@app.route("/untrack", methods=["POST"])
def untrack():
    """
    Untrack a stock.
    Expects JSON payload with 'symbol'.
    """
    data = request.get_json()
    symbol = data.get('symbol')
    
    stock = Stocks.query.filter_by(symbol=symbol, tracking=True).first()
    
    if stock:
        stock.tracking = False
        try:
            db.session.commit()
            return jsonify({"message": "Stock untracked successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    else: 
        return jsonify({"error": "Stock not found"}), 404

@app.route("/buy", methods=["POST"])
def buy_stock():
    """
    Buy shares of a stock.
    Expects JSON payload with 'symbol', 'shortName', 'amount', and 'currentPrice'.
    """
    data = request.get_json()
    print(f"Received buy request data: {data}")

    symbol = data.get('symbol')
    shortName = data.get('shortName')
    amount = data.get('amount')
    currentPrice = data.get('currentPrice')
    tracking = data.get('tracking', False)

    if not symbol or not shortName or not amount or not currentPrice:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        shares_to_add = round(amount / currentPrice, 2)
        stock = Stocks.query.filter_by(symbol=symbol).first()

        if stock:
            stock.shares = stock.shares or 0
            stock.shares += shares_to_add
        else:
            new_stock = Stocks(symbol=symbol, shortName=shortName, currentPrice=currentPrice, tracking=tracking, owned=False, shares=shares_to_add)
            db.session.add(new_stock)

        new_trade = TradeHistory(symbol=symbol, shortName=shortName, shares=shares_to_add, price=currentPrice, action="buy")
        print(new_trade)
        db.session.add(new_trade)
        db.session.commit()
        return jsonify({"message": "Stock purchase successful"}), 200
    except Exception as e:
        print(f"Error processing buy request: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

@app.route("/sell", methods=["POST"])
def sell():
    """
    Sell shares of a stock.
    Expects JSON payload with 'symbol' and 'shares'.
    """
    data = request.get_json()
    symbol = data.get('symbol')
    shares_to_sell = data.get('shares')

    stock = Stocks.query.filter_by(symbol=symbol).first()

    if stock and stock.shares:
        if shares_to_sell >= stock.shares:
            db.session.delete(stock)
            message = f"Sold all shares of {symbol}"
        else:
            stock.shares -= shares_to_sell
            message = f"Sold {shares_to_sell:.4f} shares of {symbol}"
    else:
        return jsonify({"error": "Stock not found or not owned"}), 400
    
    try:
        new_trade = TradeHistory(symbol=symbol, shortName=stock.shortName, shares=shares_to_sell, price=stock.currentPrice, action="sell")
        db.session.add(new_trade)
        print(new_trade)
        db.session.commit()
        return jsonify({"message": message})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/portfolio", methods=["GET"])
def portfolio():
    """
    Get the portfolio of owned stocks.
    """
    owned_stocks = Stocks.query.filter(Stocks.shares > 0).all()
    return jsonify([{
        "symbol": stock.symbol,
        "name": stock.shortName,
        "shares": stock.shares,
        "currentPrice": stock.currentPrice,
        "shortName": stock.shortName,
    } for stock in owned_stocks])

@app.route("/trade_history", methods=["GET"])
def trade_history():
    """
    Get the trade history.
    """
    trades = TradeHistory.query.all()
    return jsonify([{
        "symbol": trade.symbol,
        "shortName": trade.shortName,
        "shares": trade.shares,
        "price": trade.price,
        "action": trade.action,
        "timestamp": trade.timestamp
    } for trade in trades])

if __name__ == "__main__":
    app.run(debug=True)
