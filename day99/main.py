import streamlit as st
from datetime import date
import yfinance as yf
from prophet import Prophet
from prophet.plot import plot_plotly
from plotly import graph_objs as go
import warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="prophet.plot")
START = "2015-01-01"
TODAY = date.today().strftime("%Y-%m-%d")

st.title("Stock Prediction App")

stocks = ("AAPL", "GOOG", "MSFT", "GME", "AMZN", "FB", "TSLA", "NVDA", "ORCL", "JPM")
selected_stock = st.selectbox("Select dataset for prediction", stocks)

n_years = st.slider("Years of prediction: ", 1, 4)
period = n_years * 365

@st.cache_data
def loadData(ticker):
    data = yf.download(ticker, START, TODAY)
    data.reset_index(inplace=True) #put date in first column
    return data

data_load_state = st.text("Loading data..")
data = loadData(selected_stock)
data_load_state.text("Loading data...done!")


st.subheader("Raw Data")
st.write(data.tail())

def plot_row_data():
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=data['Date'], y=data['Open'], name='stock_open'))
    fig.add_trace(go.Scatter(x=data['Date'], y=data['Close'], name='stock_close'))
    fig.layout.update(title_text="Time Series Data", xaxis_rangeslider_visible=True)
    st.plotly_chart(fig)

plot_row_data()

#forcast

df_train = data[['Date', 'Close']]
df_train = df_train.rename(columns={"Date": "ds", "Close": "y"})
model = Prophet()
model.fit(df_train)
future = model.make_future_dataframe(periods=period)
forecast = model.predict(future)


st.subheader("Forecast Data")
st.write(forecast.tail())


st.write("Forecast Data")
fig1 = plot_plotly(model, forecast)
st.plotly_chart(fig1)

st.write("Forecast Components")
fig2 = model.plot_components(forecast)
st.write(fig2)
