var express = require('express');
const app = express();
var router = express.Router();
const path = require('path')
var moment = require('moment');
const {updateCurrentlyReading, currentlyreading} = require('./currentlyreading'); 
const {updateRead, read} = require('./read');
const { AAPLprice, AAPLPE, AAPLPS } = require('./aapl');
const { readAAPLdata } = require('./aapldata');

/* GET home page. */
router.get('/', async(req, res) => {
  //retrieve currentlyreading from Hardcover API and render on index.ejs
  try {
    // retrieve currently reading book from routes/currentlyreading.js
    const book = await updateCurrentlyReading(currentlyreading);
    //console.log(JSON.stringify(data));
    const books = book.me[0].user_books;
    //console.log(JSON.stringify(books));
    //get title of book
    const title = books[0].book.title;
    //console.log(title);
    //get author of book
    const author = books[0].book.contributions[0].author.name;
    //console.log(author);
    //get Hardcover.app link to book
    const slug = books[0].book.slug;
    const link = `https://hardcover.app/books/${slug}`;
    //console.log(link);
    res.render('index', { 
      title: title, 
      author: author,
      link: link
    });
  } catch (error) {
    console.error(error);
    res.render('index', { books: [], error: error.message});
  }
});

/* GET resume. */
router.get('/resume', function(req, res) {
  res.render('resume', { title: 'resume' });
});

/* GET learning. */
router.get('/learning', function(req, res) {
  res.render('learning', { title: 'learning' });
});

/* GET teaching/english9. */
router.get('/teaching/english9', function(req, res) {
  res.render('english9', { title: 'English 9 Honors' });
});

/* GET teaching/english10. */
router.get('/teaching/english10', function(req, res) {
  res.render('english10', { title: 'English 10 Honors' });
});

/* GET reading. */
router.get('/read', async(req, res) =>{
  // retrieve currently reading book from routes/read.js
  try{
    const books = await updateRead(read);
    //console.log(JSON.stringify(books));
    const readbooks = books.me[0].user_books;
    //console.log(JSON.stringify(readbooks));
    //console.log(readbooks.length);
    const bookshelf = []
    for(var i = 0; i < readbooks.length; i++){
        console.log(i)
        const dateread = moment(readbooks[i].last_read_date).format('MM/DD/YYYY');
        console.log(dateread);
        //get title of book
        const title = readbooks[i].book.title;
        console.log(title);
        //get author of book
        // const author = readbooks[i].book.contributions[0].author.name;
        // safe version with optional chaining
        const author = readbooks[i].book.contributions[0]?.author?.name ?? 'Unknown Author';         
        // console.log(author);
        // get Hardcover.app link to book
        const slug = readbooks[i].book.slug;
        const link = `https://hardcover.app/books/${slug}`;
        console.log(link);
        //push books into bookshelf array
        bookshelf.push({
          title: title, 
          author: author,
          link: link,
          dateread: dateread
        });
        //console.log(bookshelf)
    }
      //sort by dateread from most recent to least recent
      bookshelf.sort((a, b) =>{
        //convert dates to timestamps for comparison
        const dateA = new Date(a.dateread);
        const dateB = new Date(b.dateread);
        return dateB - dateA; //descending order
      });
      //console.log(bookshelf)

    res.render('read', { 
        books: bookshelf,
        title: 'reading'
    });
  } catch (error) {
    console.error(error);
    res.render('read', { books: [], error: error.message} );
  }
});

/* GET projects */
router.get('/projects', async (req, res) => {
  AAPLprice(), AAPLPE(), AAPLPS()
  res.render('projects', {title: 'projects'});
});

/* GET projects/travel */
router.get('/projects/travel', function(req, res){
  const filePath = path.join(__dirname, '../observable/dist/travel.html');
  console.log('Trying to send:', filePath);
  res.sendFile(filePath, function(err) {
    if (err) {
      console.error('sendFile error:', err);
      res.status(500).send('Error: ' + err.message);
    }
  });
});

/* GET projects/AAPL */
router.get('/projects/AAPL', function(req, res){
  const filePath = path.join(__dirname, '../observable/dist/AAPL.html');
  console.log('Trying to send:', filePath);
  res.sendFile(filePath, function(err) {
    if (err) {
      console.error('sendFile error:', err);
      res.status(500).send('Error: ' + err.message);
    }
  });
});

/* GET projects/AAPL2 */
router.get('/projects/AAPL2', async (req, res)  => {
  //AAPLprice(), AAPLPE(), AAPLPS()
  const { priceJsonData, peJsonData, psJsonData } = await readAAPLdata();
  //console.log(priceJsonData);
  //console.log(peJsonData);
  //console.log(psJsonData);
  const date = moment(priceJsonData[priceJsonData.length-1][0], 'YYYY-MM-DD').format('MM/DD/YYYY')
  //console.log(date)
  const price = priceJsonData[priceJsonData.length-1][1]
  //console.log(price)
  const pe = peJsonData[peJsonData.length-1][1]
  //console.log(pe)
  const PEmean = peJsonData[peJsonData.length-1][2]
  const PEplus2stddev = peJsonData[peJsonData.length-1][3]
  const PEplus1stddev = peJsonData[peJsonData.length-1][4]
  const PEminus1stddev = peJsonData[peJsonData.length-1][5]
  const PEminus2stddev = peJsonData[peJsonData.length-1][6]
  const ps = psJsonData[psJsonData.length-1][1]
  //console.log(ps)
  const PSmean = psJsonData[psJsonData.length-1][2]
  //console.log(PSmean)
  const PSplus2stddev = psJsonData[psJsonData.length-1][3]
  //console.log(PSplus2stddev)
  const PSplus1stddev = psJsonData[psJsonData.length-1][4]
  //console.log(PSplus1stddev)
  const PSminus1stddev = psJsonData[psJsonData.length-1][5]
  const PSminus2stddev = psJsonData[psJsonData.length-1][6]
  // console.log('Retrieved data from json files')
  // pass the extracted data to AAPL.ejs view
  res.render('AAPL2', {
    date: date,
    price: price,
    pe: pe,  
    PEmean: PEmean,
    PEplus2stddev: PEplus2stddev,
    PEplus1stddev: PEplus1stddev,
    PEminus1stddev: PEminus1stddev,
    PEminus2stddev: PEminus2stddev,
    ps: ps,
    PSmean: PSmean,
    PSplus2stddev: PSplus2stddev,
    PSplus1stddev: PSplus1stddev,
    PSminus1stddev: PSminus1stddev,
    PSminus2stddev: PSminus2stddev
    })
})

/* GET projects/plants */
router.get('/projects/plants', function(req, res) {
  res.render('plants', { 
    title: 'plants', 
    codeSnippet1: `<font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ArduinoJson</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">Arduino</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">Adafruit_Sensor</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">DHT</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">PubSubClient</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#d35400">ESP8266WiFi</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiAP</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiGeneric</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">ESP8266WiFiMulti</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiScan</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiSTA</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiType</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">LiquidCrystal</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">LiquidCrystal_I2C</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#d35400">WiFiClient</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">WiFiClientSecure</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#d35400">WiFiServer</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">WiFiUdp</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#d35400">Wire</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                        
                        <font color="#00979c">const</font> <font color="#00979c">char</font><font color="#434f54">*</font> <font color="#000000">ssid</font><font color="#434f54">=</font> <font color="#434f54">&#47;&#47;Wi-Fi network</font>
                        <font color="#00979c">const</font> <font color="#00979c">char</font><font color="#434f54">*</font> <font color="#000000">password</font> <font color="#434f54">=</font> <font color="#434f54">&#47;&#47;Wi-Fi password</font>
                        <font color="#00979c">const</font> <font color="#00979c">char</font><font color="#434f54">*</font> <font color="#000000">mqtt_server</font> <font color="#434f54">=</font> <font color="#005c5f">&#34;192.168.1.150&#34;</font><font color="#000000">;</font>
                        
                        <font color="#5e6d03">#define</font> <font color="#000000">humidity_topic</font> <font color="#005c5f">&#34;sensor&#47;humidity&#34;</font>
                        <font color="#5e6d03">#define</font> <font color="#000000">temperature_topic</font> <font color="#005c5f">&#34;sensor&#47;temperature&#34;</font>
                        
                        <font color="#5e6d03">#define</font> <font color="#000000">DHTPIN</font> <font color="#000000">7</font>
                        <font color="#5e6d03">#define</font> <font color="#000000">DHTTYPE</font> <font color="#00979c">DHT11</font>
                        <font color="#5e6d03">#define</font> <font color="#000000">DHTPIN</font> <font color="#000000">2</font> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;Connect the VMA311 sensor to Pin D4 of Node MCU</font>
                        
                        <font color="#d35400">WiFiClient</font> <font color="#000000">espClient</font><font color="#000000">;</font>
                        <b><font color="#d35400">PubSubClient</font></b> <font color="#d35400">client</font><font color="#000000">(</font><font color="#000000">espClient</font><font color="#000000">)</font><font color="#000000">;</font>
                        <b><font color="#d35400">DHT</font></b> <font color="#000000">dht</font><font color="#000000">(</font><font color="#000000">DHTPIN</font><font color="#434f54">,</font> <font color="#000000">DHTTYPE</font><font color="#434f54">,</font> <font color="#000000">11</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                        <font color="#434f54">&#47;&#47;set LCD address to 0x38 for a 16 chars and 2 line display</font>
                        <b><font color="#d35400">LiquidCrystal_I2C</font></b> <font color="#000000">lcd</font><font color="#000000">(</font><font color="#000000">0x38</font><font color="#434f54">,</font> <font color="#000000">16</font><font color="#434f54">,</font> <font color="#000000">2</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                        <font color="#00979c">char</font> <font color="#000000">dataString</font><font color="#000000">[</font><font color="#000000">50</font><font color="#000000">]</font> <font color="#434f54">=</font> <font color="#000000">{</font><font color="#000000">0</font><font color="#000000">}</font><font color="#000000">;</font>
                        <font color="#00979c">int</font> <font color="#000000">a</font> <font color="#434f54">=</font> <font color="#000000">0</font><font color="#000000">;</font>
                        
                        <font color="#00979c">void</font> <font color="#5e6d03">setup</font><font color="#000000">(</font><font color="#000000">)</font> <font color="#000000">{</font>
                         &nbsp;<font color="#434f54">&#47;&#47; put your setup code here, to run once:</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">begin</font><font color="#000000">(</font><font color="#000000">115200</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">dht</font><font color="#434f54">.</font><font color="#d35400">begin</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">setup_wifi</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">setServer</font><font color="#000000">(</font><font color="#000000">mqtt_server</font><font color="#434f54">,</font> <font color="#000000">1883</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">begin</font><font color="#000000">(</font><font color="#000000">16</font><font color="#434f54">,</font><font color="#000000">2</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">init</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">backlight</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                        <font color="#000000">}</font>
                        
                        <font color="#00979c">void</font> <font color="#000000">setup_wifi</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">10</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#434f54">&#47;&#47;connect to Wi-Fi</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;connecting to &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#000000">ssid</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<b><font color="#d35400">WiFi</font></b><font color="#434f54">.</font><font color="#d35400">begin</font><font color="#000000">(</font><font color="#000000">ssid</font><font color="#434f54">,</font> <font color="#000000">password</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#5e6d03">while</font><font color="#000000">(</font><b><font color="#d35400">WiFi</font></b><font color="#434f54">.</font><font color="#d35400">status</font><font color="#000000">(</font><font color="#000000">)</font> <font color="#434f54">!=</font> <font color="#000000">WL_CONNECTED</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">500</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;.&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">}</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;Wi-Fi connected&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;IP address: &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><b><font color="#d35400">WiFi</font></b><font color="#434f54">.</font><font color="#d35400">localIP</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                        <font color="#000000">}</font>
                        
                        <font color="#00979c">void</font> <font color="#d35400">reconnect</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;<font color="#5e6d03">while</font><font color="#000000">(</font><font color="#434f54">!</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">connected</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Attempting MQTT connection...&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">connect</font><font color="#000000">(</font><font color="#005c5f">&#34;Sensors&#34;</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;connected&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">}</font> <font color="#5e6d03">else</font> <font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;failed, rc= &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#000000">state</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;Try again in 5 seconds&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">5000</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">}</font>
                         &nbsp;<font color="#000000">}</font>
                        <font color="#000000">}</font>
                        
                        <font color="#00979c">bool</font> <font color="#000000">checkBound</font><font color="#000000">(</font><font color="#00979c">float</font> <font color="#000000">newValue</font><font color="#434f54">,</font> <font color="#00979c">float</font> <font color="#000000">prevValue</font><font color="#434f54">,</font> <font color="#00979c">float</font> <font color="#000000">maxDiff</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;<font color="#5e6d03">return</font> <font color="#434f54">!</font><font color="#d35400">isnan</font><font color="#000000">(</font><font color="#000000">newValue</font><font color="#000000">)</font> <font color="#434f54">&amp;&amp;</font> <font color="#000000">(</font><font color="#000000">newValue</font> <font color="#434f54">&lt;</font> <font color="#000000">prevValue</font> <font color="#434f54">-</font> <font color="#000000">maxDiff</font> <font color="#434f54">||</font> <font color="#000000">newValue</font> <font color="#434f54">&gt;</font> <font color="#000000">prevValue</font> <font color="#434f54">+</font> <font color="#000000">maxDiff</font><font color="#000000">)</font><font color="#000000">;</font>
                        <font color="#000000">}</font>
                        
                        <font color="#00979c">long</font> <font color="#000000">lastMsg</font> <font color="#434f54">=</font> <font color="#000000">0</font><font color="#000000">;</font>
                        <font color="#00979c">float</font> <font color="#000000">tempC</font> <font color="#434f54">=</font> <font color="#000000">0.0</font><font color="#000000">;</font>
                        <font color="#00979c">float</font> <font color="#000000">tempF</font> <font color="#434f54">=</font> <font color="#000000">0.0</font><font color="#000000">;</font>
                        <font color="#00979c">float</font> <font color="#d35400">humidity</font> <font color="#434f54">=</font> <font color="#000000">0.0</font><font color="#000000">;</font>
                        <font color="#00979c">float</font> <font color="#000000">difference</font> <font color="#434f54">=</font> <font color="#000000">1.0</font><font color="#000000">;</font>
                        
                        <font color="#00979c">void</font> <font color="#5e6d03">loop</font><font color="#000000">(</font><font color="#000000">)</font> <font color="#000000">{</font>
                         &nbsp;<font color="#434f54">&#47;&#47; put your main code here, to run repeatedly:</font>
                         &nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#434f54">!</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">connected</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;<font color="#d35400">reconnect</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">}</font>
                         &nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#5e6d03">loop</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">home</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;
                         &nbsp;<font color="#00979c">long</font> <font color="#d35400">now</font> <font color="#434f54">=</font> <font color="#d35400">millis</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#d35400">now</font> <font color="#434f54">-</font> <font color="#000000">lastMsg</font> <font color="#434f54">&gt;</font> <font color="#000000">2000</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">lastMsg</font> <font color="#434f54">=</font> <font color="#d35400">now</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#00979c">float</font> <font color="#000000">h</font> <font color="#434f54">=</font> <font color="#000000">dht</font><font color="#434f54">.</font><font color="#d35400">readHumidity</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#00979c">float</font> <font color="#000000">c</font> <font color="#434f54">=</font> <font color="#000000">dht</font><font color="#434f54">.</font><font color="#d35400">readTemperature</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;Celsius</font>
                         &nbsp;<font color="#00979c">float</font> <font color="#000000">f</font> <font color="#434f54">=</font> <font color="#000000">dht</font><font color="#434f54">.</font><font color="#d35400">readTemperature</font><font color="#000000">(</font><font color="#00979c">true</font><font color="#000000">)</font><font color="#000000">;</font> &nbsp;<font color="#434f54">&#47;&#47;Fahrenheit</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;set the cursor to (0,0);</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">setCursor</font><font color="#000000">(</font><font color="#000000">0</font><font color="#434f54">,</font><font color="#000000">0</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;print temperature on LCD screen</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Temperature &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#000000">f</font><font color="#434f54">,</font><font color="#000000">0</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#000000">(</font><font color="#00979c">char</font><font color="#000000">)</font><font color="#000000">223</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;F&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;set the cursor to (16,1);</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">setCursor</font><font color="#000000">(</font><font color="#000000">0</font><font color="#434f54">,</font><font color="#000000">1</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;print humidity on LCD screen</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Humidity &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#000000">h</font><font color="#434f54">,</font> <font color="#000000">1</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#000000">lcd</font><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;%&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;a value increase every loop</font>
                         &nbsp;<font color="#000000">a</font><font color="#434f54">++</font><font color="#000000">;</font>
                         &nbsp;
                         &nbsp;<font color="#434f54">&#47;&#47;convert a value to hexa</font>
                         &nbsp;<font color="#434f54">&#47;&#47;sprintf(dataString,&#34;%02x&#34;,a);</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;send the data</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#000000">dataString</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;print temperature to serial monitor</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Temperature: &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#000000">f</font><font color="#434f54">,</font> <font color="#000000">1</font><font color="#000000">)</font><font color="#000000">;</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;print humidity to serial monitor</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;F, Humidity: &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#000000">h</font><font color="#434f54">,</font> <font color="#000000">0</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;%&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">1000</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;
                         &nbsp;<font color="#434f54">&#47;&#47;do not publish temperature in Celsius </font>
                        <font color="#434f54">&#47;&#47; &nbsp;if(checkBound(c, tempC, difference)){</font>
                        <font color="#434f54">&#47;&#47; &nbsp;&nbsp;&nbsp;tempC = c;</font>
                        <font color="#434f54">&#47;&#47; &nbsp;&nbsp;&nbsp;Serial.print(&#34;Temperature: &#34;);</font>
                        <font color="#434f54">&#47;&#47; &nbsp;&nbsp;&nbsp;Serial.print(String(tempC).c_str());</font>
                        <font color="#434f54">&#47;&#47; &nbsp;&nbsp;&nbsp;Serial.println(&#34;*C&#34;);</font>
                        <font color="#434f54">&#47;&#47; &nbsp;&nbsp;&nbsp;client.publish(temperature_topic, String(tempC).c_str(), true);</font>
                        <font color="#434f54">&#47;&#47; &nbsp;&nbsp;&nbsp;}</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;publish temperature in Fahrenheit if changes 1 degree</font>
                         &nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#000000">checkBound</font><font color="#000000">(</font><font color="#000000">f</font><font color="#434f54">,</font> <font color="#000000">tempF</font><font color="#434f54">,</font> <font color="#000000">difference</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">tempF</font> <font color="#434f54">=</font> <font color="#000000">f</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Temperature: &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#00979c">String</font><font color="#000000">(</font><font color="#000000">tempF</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">c_str</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;*F&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">publish</font><font color="#000000">(</font><font color="#000000">temperature_topic</font><font color="#434f54">,</font> <font color="#00979c">String</font><font color="#000000">(</font><font color="#000000">tempF</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">c_str</font><font color="#000000">(</font><font color="#000000">)</font><font color="#434f54">,</font> <font color="#00979c">true</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">}</font>
                        
                         &nbsp;<font color="#434f54">&#47;&#47;publish humidity if changes 1 degree</font>
                         &nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#000000">checkBound</font><font color="#000000">(</font><font color="#000000">h</font><font color="#434f54">,</font> <font color="#d35400">humidity</font><font color="#434f54">,</font> <font color="#000000">difference</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                         &nbsp;&nbsp;&nbsp;<font color="#d35400">humidity</font> <font color="#434f54">=</font> <font color="#000000">h</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Humidity: &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#00979c">String</font><font color="#000000">(</font><font color="#d35400">humidity</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">c_str</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">publish</font><font color="#000000">(</font><font color="#000000">humidity_topic</font><font color="#434f54">,</font> <font color="#00979c">String</font><font color="#000000">(</font><font color="#d35400">humidity</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">c_str</font><font color="#000000">(</font><font color="#000000">)</font><font color="#434f54">,</font> <font color="#00979c">true</font><font color="#000000">)</font><font color="#000000">;</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">}</font>
                         &nbsp;<font color="#000000">}</font>
                        <font color="#000000">}</font>`,
    codeSnippet2: `<font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ArduinoJson</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">Arduino</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">Adafruit_Sensor</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">PubSubClient</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#d35400">ESP8266WiFi</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiAP</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiGeneric</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">ESP8266WiFiMulti</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiScan</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiSTA</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#000000">ESP8266WiFiType</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#d35400">WiFiClient</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">WiFiClientSecure</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><font color="#d35400">WiFiServer</font><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      <font color="#5e6d03">#include</font> <font color="#434f54">&lt;</font><b><font color="#d35400">WiFiUdp</font></b><font color="#434f54">.</font><font color="#000000">h</font><font color="#434f54">&gt;</font>
                      
                      <font color="#00979c">const</font> <font color="#00979c">char</font><font color="#434f54">*</font> <font color="#000000">ssid</font><font color="#434f54">=</font> <font color="#434f54">&#47;&#47;Wi-Fi network</font>
                      <font color="#00979c">const</font> <font color="#00979c">char</font><font color="#434f54">*</font> <font color="#000000">password</font> <font color="#434f54">=</font> <font color="#434f54">&#47;&#47;Wi-Fi password</font>
                      <font color="#00979c">const</font> <font color="#00979c">char</font><font color="#434f54">*</font> <font color="#000000">mqtt_server</font> <font color="#434f54">=</font> <font color="#005c5f">&#34;192.168.1.150&#34;</font><font color="#000000">;</font>
                      
                      <font color="#00979c">int</font> <font color="#000000">sensor_pin</font> <font color="#434f54">=</font> <font color="#000000">A0</font><font color="#000000">;</font> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;set AO as pin for YL-69</font>
                      <font color="#00979c">int</font> <font color="#000000">LEDPin</font> <font color="#434f54">=</font> <font color="#000000">13</font><font color="#000000">;</font> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;sets D7 as pin for LED</font>
                      <font color="#00979c">int</font> <font color="#000000">m</font><font color="#434f54">=</font><font color="#000000">0</font><font color="#000000">;</font>
                      
                      <font color="#5e6d03">#define</font> <font color="#000000">moisture_topic</font> <font color="#005c5f">&#34;sensor&#47;moisture&#34;</font>
                      
                      <font color="#d35400">WiFiClient</font> <font color="#000000">espClient</font><font color="#000000">;</font>
                      <b><font color="#d35400">PubSubClient</font></b> <font color="#d35400">client</font><font color="#000000">(</font><font color="#000000">espClient</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                      <font color="#00979c">void</font> <font color="#5e6d03">setup</font><font color="#000000">(</font><font color="#000000">)</font> <font color="#000000">{</font>
                       &nbsp;<font color="#434f54">&#47;&#47; put your setup code here, to run once:</font>
                       &nbsp;<font color="#d35400">pinMode</font><font color="#000000">(</font><font color="#000000">LEDPin</font><font color="#434f54">,</font> <font color="#00979c">OUTPUT</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<font color="#d35400">digitalWrite</font><font color="#000000">(</font><font color="#000000">LEDPin</font><font color="#434f54">,</font> <font color="#00979c">LOW</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">begin</font><font color="#000000">(</font><font color="#000000">115200</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<font color="#000000">setup_wifi</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">setServer</font><font color="#000000">(</font><font color="#000000">mqtt_server</font><font color="#434f54">,</font> <font color="#000000">1883</font><font color="#000000">)</font><font color="#000000">;</font>
                      <font color="#000000">}</font>
                      
                      <font color="#00979c">void</font> <font color="#000000">setup_wifi</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">10</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<font color="#434f54">&#47;&#47;connect to Wi-Fi</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;connecting to &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#000000">ssid</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                       &nbsp;<b><font color="#d35400">WiFi</font></b><font color="#434f54">.</font><font color="#d35400">begin</font><font color="#000000">(</font><font color="#000000">ssid</font><font color="#434f54">,</font> <font color="#000000">password</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                       &nbsp;<font color="#5e6d03">while</font><font color="#000000">(</font><b><font color="#d35400">WiFi</font></b><font color="#434f54">.</font><font color="#d35400">status</font><font color="#000000">(</font><font color="#000000">)</font> <font color="#434f54">!=</font> <font color="#000000">WL_CONNECTED</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">500</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;.&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<font color="#000000">}</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;Wi-Fi connected&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;IP address: &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><b><font color="#d35400">WiFi</font></b><font color="#434f54">.</font><font color="#d35400">localIP</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                      <font color="#000000">}</font>
                      
                      <font color="#00979c">void</font> <font color="#d35400">reconnect</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;<font color="#5e6d03">while</font><font color="#000000">(</font><font color="#434f54">!</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">connected</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Attempting MQTT connection...&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">connect</font><font color="#000000">(</font><font color="#005c5f">&#34;Sensors&#34;</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;connected&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">}</font> <font color="#5e6d03">else</font> <font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;failed, rc= &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#000000">state</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#005c5f">&#34;Try again in 5 seconds&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">5000</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">}</font>
                       &nbsp;<font color="#000000">}</font>
                      <font color="#000000">}</font>
                      
                      <font color="#00979c">void</font> <font color="#5e6d03">loop</font><font color="#000000">(</font><font color="#000000">)</font> <font color="#000000">{</font>
                       &nbsp;<font color="#434f54">&#47;&#47; put your main code here, to run repeatedly:</font>
                       &nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#434f54">!</font><font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">connected</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;<font color="#d35400">reconnect</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">}</font>
                       &nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#5e6d03">loop</font><font color="#000000">(</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                       &nbsp;<font color="#434f54">&#47;&#47;publish moisture</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">m</font> <font color="#434f54">=</font> <font color="#d35400">analogRead</font><font color="#000000">(</font><font color="#000000">sensor_pin</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">m</font> <font color="#434f54">=</font> <font color="#d35400">constrain</font><font color="#000000">(</font><font color="#000000">m</font><font color="#434f54">,</font> <font color="#000000">485</font><font color="#434f54">,</font> <font color="#000000">1023</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">m</font> <font color="#434f54">=</font> <font color="#d35400">map</font><font color="#000000">(</font><font color="#000000">m</font><font color="#434f54">,</font> <font color="#000000">485</font><font color="#434f54">,</font> <font color="#000000">1023</font><font color="#434f54">,</font> <font color="#000000">100</font><font color="#434f54">,</font> <font color="#000000">0</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Moisture: &#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="#d35400">Serial</font></b><font color="#434f54">.</font><font color="#d35400">println</font><font color="#000000">(</font><font color="#000000">m</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">publish</font><font color="#000000">(</font><font color="#000000">moisture_topic</font><font color="#434f54">,</font> <font color="#00979c">String</font><font color="#000000">(</font><font color="#000000">m</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">c_str</font><font color="#000000">(</font><font color="#000000">)</font><font color="#434f54">,</font> <font color="#00979c">true</font><font color="#000000">)</font><font color="#000000">;</font> &nbsp;
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;turn on LED light if soil moisture &lt; 30%</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#5e6d03">if</font><font color="#000000">(</font><font color="#000000">m</font> <font color="#434f54">&lt;</font> <font color="#000000">30</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">digitalWrite</font><font color="#000000">(</font><font color="#000000">LEDPin</font><font color="#434f54">,</font> <font color="#00979c">LOW</font><font color="#000000">)</font><font color="#000000">;</font> 
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">}</font> 
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#5e6d03">else</font> <font color="#5e6d03">if</font><font color="#000000">(</font><font color="#000000">m</font> <font color="#434f54">&gt;</font> <font color="#000000">30</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">digitalWrite</font><font color="#000000">(</font><font color="#000000">LEDPin</font><font color="#434f54">,</font> <font color="#00979c">HIGH</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">}</font> 
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;every hour</font>
                       &nbsp;&nbsp;&nbsp;<font color="#d35400">delay</font><font color="#000000">(</font><font color="#000000">1000</font><font color="#434f54">*</font><font color="#000000">60</font><font color="#434f54">*</font><font color="#000000">60</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;<font color="#000000">}</font>`,
      codeSnippet3: `<font color="#000000">import</font> <font color="#000000">paho</font><font color="#434f54">.</font><font color="#000000">mqtt</font><font color="#434f54">.</font><font color="#d35400">client</font> <font color="#d35400">as</font> <font color="#000000">mqtt</font>
                        <font color="#000000">import</font> <font color="#000000">datetime</font>
                        <font color="#000000">from</font> <font color="#000000">pymongo</font> <font color="#000000">import</font> <font color="#000000">MongoClient</font>
                        
                        <font color="#000000">def</font> <font color="#000000">on_connect</font><font color="#000000">(</font><font color="#d35400">client</font><font color="#434f54">,</font> <font color="#000000">userdata</font><font color="#434f54">,</font> <font color="#000000">flags</font><font color="#434f54">,</font> <font color="#000000">rc</font><font color="#000000">)</font><font color="#434f54">:</font>
                         &nbsp;&nbsp;&nbsp;<font color="#d35400">print</font><font color="#000000">(</font><font color="#005c5f">&#34;Connected with result code &#34;</font><font color="#434f54">+</font><font color="#000000">str</font><font color="#000000">(</font><font color="#000000">rc</font><font color="#000000">)</font><font color="#000000">)</font>
                         &nbsp;&nbsp;&nbsp;<font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">subscribe</font><font color="#000000">(</font><font color="#005c5f">&#34;&#47;sensor&#47;#&#34;</font><font color="#000000">)</font>
                        
                        <font color="#000000">def</font> <font color="#000000">on_message</font><font color="#000000">(</font><font color="#d35400">client</font><font color="#434f54">,</font> <font color="#000000">userdata</font><font color="#434f54">,</font> <font color="#000000">msg</font><font color="#000000">)</font><font color="#434f54">:</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">receiveTime</font><font color="#434f54">=</font><font color="#000000">datetime</font><font color="#434f54">.</font><font color="#000000">datetime</font><font color="#434f54">.</font><font color="#d35400">now</font><font color="#000000">(</font><font color="#000000">)</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">message</font><font color="#434f54">=</font><font color="#000000">msg</font><font color="#434f54">.</font><font color="#000000">payload</font><font color="#434f54">.</font><font color="#d35400">decode</font><font color="#000000">(</font><font color="#005c5f">&#34;utf-8&#34;</font><font color="#000000">)</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">isfloatValue</font><font color="#434f54">=</font><font color="#000000">False</font>
                         &nbsp;&nbsp;&nbsp;<font color="#5e6d03">try</font><font color="#434f54">:</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">#convert</font> <font color="#000000">the</font> <font color="#000000">string</font> <font color="#d35400">to</font> <font color="#000000">a</font> <font color="#00979c">float</font> <font color="#000000">so</font> <font color="#000000">that</font> <font color="#000000">it</font> <font color="#000000">is</font> <font color="#000000">stored</font> <font color="#d35400">as</font> <font color="#000000">a</font> <font color="#000000">number</font> <font color="#5e6d03">and</font> <font color="#5e6d03">not</font> <font color="#000000">a</font> <font color="#000000">string</font> <font color="#000000">in</font> <font color="#000000">the</font> <font color="#000000">database</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">val</font> <font color="#434f54">=</font> <font color="#00979c">float</font><font color="#000000">(</font><font color="#000000">message</font><font color="#000000">)</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">isfloatValue</font><font color="#434f54">=</font><font color="#000000">True</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">except</font><font color="#434f54">:</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">isfloatValue</font><font color="#434f54">=</font><font color="#000000">False</font>
                        
                         &nbsp;&nbsp;&nbsp;<font color="#5e6d03">if</font> <font color="#000000">isfloatValue</font><font color="#434f54">:</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">print</font><font color="#000000">(</font><font color="#000000">str</font><font color="#000000">(</font><font color="#000000">receiveTime</font><font color="#000000">)</font><font color="#434f54">+</font><font color="#005c5f">&#34;: &#34;</font><font color="#434f54">+</font><font color="#000000">msg</font><font color="#434f54">.</font><font color="#000000">topic</font><font color="#434f54">+</font><font color="#005c5f">&#34; &#34;</font><font color="#434f54">+</font><font color="#000000">str</font><font color="#000000">(</font><font color="#d35400">val</font><font color="#000000">)</font><font color="#000000">)</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">post</font><font color="#434f54">=</font><font color="#000000">{</font><font color="#005c5f">&#34;time&#34;</font><font color="#434f54">:</font><font color="#000000">receiveTime</font><font color="#434f54">,</font><font color="#005c5f">&#34;topic&#34;</font><font color="#434f54">:</font><font color="#000000">msg</font><font color="#434f54">.</font><font color="#000000">topic</font><font color="#434f54">,</font><font color="#005c5f">&#34;value&#34;</font><font color="#434f54">:</font> <font color="#d35400">val</font><font color="#000000">}</font>
                         &nbsp;&nbsp;&nbsp;<font color="#5e6d03">else</font><font color="#434f54">:</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">print</font><font color="#000000">(</font><font color="#000000">str</font><font color="#000000">(</font><font color="#000000">receiveTime</font><font color="#000000">)</font><font color="#434f54">+</font><font color="#005c5f">&#34;: &#34;</font><font color="#434f54">+</font><font color="#000000">msg</font><font color="#434f54">.</font><font color="#000000">topic</font><font color="#434f54">+</font><font color="#005c5f">&#34; &#34;</font><font color="#434f54">+</font><font color="#000000">message</font><font color="#000000">)</font>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#d35400">post</font><font color="#434f54">=</font><font color="#000000">{</font><font color="#005c5f">&#34;time&#34;</font><font color="#434f54">:</font><font color="#000000">receiveTime</font><font color="#434f54">,</font><font color="#005c5f">&#34;topic&#34;</font><font color="#434f54">:</font><font color="#000000">msg</font><font color="#434f54">.</font><font color="#000000">topic</font><font color="#434f54">,</font><font color="#005c5f">&#34;value&#34;</font><font color="#434f54">:</font> <font color="#000000">message</font><font color="#000000">}</font>
                         &nbsp;&nbsp;&nbsp;<font color="#000000">collection</font><font color="#434f54">.</font><font color="#000000">insert_one</font><font color="#000000">(</font><font color="#d35400">post</font><font color="#000000">)</font>
                        
                        <font color="#000000">#set</font> <font color="#000000">up</font> <font color="#d35400">client</font> <font color="#5e6d03">for</font> <font color="#000000">MongoDB</font> &nbsp;&nbsp;
                        
                        <font color="#000000">mongoClient</font><font color="#434f54">=</font><font color="#000000">MongoClient</font><font color="#000000">(</font><font color="#000000">&#39;mongodb:&#47;&#47;tschang:&lt;password&gt;@plants-shard-00-00-l7uuf.mongdb.net:27017,plants-shard-00-01-l7uuf.mongodb.net:27017,plants-shard-00-02-l7uuf.mongodb.net:27017&#47;basil?ssl=true&amp;replicaSet=plants-shard-0&amp;authSource=admin&amp;retryWrites=true&#39;</font><font color="#000000">)</font>
                        <font color="#000000">db</font><font color="#434f54">=</font><font color="#000000">mongoClient</font><font color="#434f54">.</font><font color="#000000">basil</font>
                        <font color="#000000">collection</font><font color="#434f54">=</font><font color="#000000">db</font><font color="#434f54">.</font><font color="#000000">july2020</font>
                        
                        <font color="#000000">#initialize</font> <font color="#000000">the</font> <font color="#d35400">client</font> <font color="#000000">that</font> <font color="#000000">should</font> <font color="#d35400">connect</font> <font color="#d35400">to</font> <font color="#000000">the</font> <font color="#000000">Mosquitto</font> <font color="#000000">broker</font>
                        <font color="#d35400">client</font> <font color="#434f54">=</font> <font color="#000000">mqtt</font><font color="#434f54">.</font><b><font color="#d35400">Client</font></b><font color="#000000">(</font><font color="#000000">)</font>
                        <font color="#d35400">client</font><font color="#434f54">.</font><font color="#000000">on_connect</font> <font color="#434f54">=</font> <font color="#000000">on_connect</font>
                        <font color="#d35400">client</font><font color="#434f54">.</font><font color="#000000">on_message</font> <font color="#434f54">=</font> <font color="#000000">on_message</font>
                        <font color="#d35400">client</font><font color="#434f54">.</font><font color="#d35400">connect</font><font color="#000000">(</font><font color="#005c5f">&#34;192.168.1.150&#34;</font><font color="#434f54">,</font> <font color="#000000">1883</font><font color="#434f54">,</font> <font color="#000000">60</font><font color="#000000">)</font>
                        <font color="#000000">#blocking</font> <font color="#5e6d03">loop</font> <font color="#d35400">to</font> <font color="#000000">the</font> <font color="#000000">Mosquitto</font> <font color="#000000">broker</font>
                        <font color="#d35400">client</font><font color="#434f54">.</font><font color="#000000">loop_forever</font><font color="#000000">(</font><font color="#000000">)</font>`,
    codeSnippet4: `<font color="#434f54">&lt;</font><font color="#000000">script</font><font color="#434f54">&gt;</font>
            
                      <font color="#434f54">&#47;&#47;set margins and size of graph</font>
                      <font color="#000000">var</font> <font color="#000000">margin</font> <font color="#434f54">=</font> <font color="#000000">{</font><font color="#000000">top</font><font color="#434f54">:</font> <font color="#000000">10</font><font color="#434f54">,</font> <font color="#000000">right</font><font color="#434f54">:</font> <font color="#000000">20</font><font color="#434f54">,</font> <font color="#000000">bottom</font><font color="#434f54">:</font> <font color="#000000">20</font><font color="#434f54">,</font> <font color="#000000">left</font><font color="#434f54">:</font> <font color="#000000">30</font><font color="#000000">}</font><font color="#434f54">,</font>
                       &nbsp;<font color="#000000">height</font> <font color="#434f54">=</font> <font color="#000000">200</font> <font color="#434f54">-</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">top</font> <font color="#434f54">-</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">bottom</font><font color="#434f54">,</font>
                       &nbsp;<font color="#000000">width</font> <font color="#434f54">=</font> <font color="#000000">1150</font> <font color="#434f54">-</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">left</font> <font color="#434f54">-</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">right</font>
                      
                      <font color="#434f54">&#47;&#47;set x-axis range</font>
                      <font color="#000000">var</font> <font color="#000000">x</font> <font color="#434f54">=</font> <font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">scaleTime</font><font color="#000000">(</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">range</font><font color="#000000">(</font><font color="#000000">[</font><font color="#000000">0</font><font color="#434f54">,</font> <font color="#000000">width</font> <font color="#434f54">-</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">right</font><font color="#000000">]</font><font color="#000000">)</font>
                      
                      <font color="#434f54">&#47;&#47;set y-axis range</font>
                      <font color="#000000">var</font> <font color="#000000">y</font> <font color="#434f54">=</font> <font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">scaleLinear</font><font color="#000000">(</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">range</font><font color="#000000">(</font><font color="#000000">[</font><font color="#000000">height</font><font color="#434f54">,</font> <font color="#000000">0</font><font color="#000000">]</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                      <font color="#434f54">&#47;&#47;draw moisture chart</font>
                      <font color="#000000">var</font> <font color="#000000">svg1</font> <font color="#434f54">=</font> <font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">select</font><font color="#000000">(</font><font color="#005c5f">&#34;div#moisture&#34;</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">append</font><font color="#000000">(</font><font color="#005c5f">&#34;svg&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;width&#34;</font><font color="#434f54">,</font> <font color="#000000">width</font> <font color="#434f54">+</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">left</font> <font color="#434f54">+</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">right</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;height&#34;</font><font color="#434f54">,</font> <font color="#000000">height</font> <font color="#434f54">+</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">top</font> <font color="#434f54">+</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">bottom</font><font color="#000000">)</font>
                       &nbsp;<font color="#434f54">.</font><font color="#000000">append</font><font color="#000000">(</font><font color="#005c5f">&#34;g&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;transform&#34;</font><font color="#434f54">,</font> <font color="#005c5f">&#34;translate(&#34;</font> <font color="#434f54">+</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">left</font> <font color="#434f54">+</font> <font color="#005c5f">&#34;,&#34;</font> <font color="#434f54">+</font> <font color="#000000">margin</font><font color="#434f54">.</font><font color="#000000">top</font> <font color="#434f54">+</font> <font color="#005c5f">&#34;)&#34;</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                      <font color="#434f54">&#47;&#47;retrieve moisture data in json format from .&#47;projects&#47;plants&#47;moisture</font>
                      <font color="#000000">var</font> <font color="#000000">moistureurl</font><font color="#434f54">=</font><font color="#005c5f">&#34;.&#47;moisture&#34;</font>
                      
                      <font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">json</font><font color="#000000">(</font><font color="#000000">moistureurl</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">then</font><font color="#000000">(</font><font color="#000000">function</font><font color="#000000">(</font><font color="#d35400">data</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;format moisture data</font>
                       &nbsp;&nbsp;&nbsp;<font color="#d35400">data</font><font color="#434f54">.</font><font color="#000000">forEach</font><font color="#000000">(</font><font color="#000000">function</font><font color="#000000">(</font><font color="#000000">d</font><font color="#000000">)</font><font color="#000000">{</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">d</font><font color="#434f54">.</font><font color="#d35400">time</font> <font color="#434f54">=</font> <font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">isoParse</font><font color="#000000">(</font><font color="#000000">d</font><font color="#434f54">.</font><font color="#d35400">time</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">d</font><font color="#434f54">.</font><font color="#000000">value</font> <font color="#434f54">=</font> <font color="#434f54">+</font><font color="#000000">d</font><font color="#434f54">.</font><font color="#000000">value</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">}</font><font color="#000000">)</font>
                      
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;set the ranges of the data</font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">x</font><font color="#434f54">.</font><font color="#000000">domain</font><font color="#000000">(</font><font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">extent</font><font color="#000000">(</font><font color="#d35400">data</font><font color="#434f54">,</font> <font color="#000000">function</font><font color="#000000">(</font><font color="#000000">d</font><font color="#000000">)</font> <font color="#000000">{</font> <font color="#5e6d03">return</font> <font color="#000000">d</font><font color="#434f54">.</font><font color="#d35400">time</font><font color="#000000">;</font><font color="#000000">}</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">y</font><font color="#434f54">.</font><font color="#000000">domain</font><font color="#000000">(</font><font color="#000000">[</font><font color="#000000">0</font><font color="#434f54">,</font> <font color="#000000">d3</font><font color="#434f54">.</font><font color="#d35400">max</font><font color="#000000">(</font><font color="#d35400">data</font><font color="#434f54">,</font> <font color="#000000">function</font><font color="#000000">(</font><font color="#000000">d</font><font color="#000000">)</font> <font color="#000000">{</font> <font color="#5e6d03">return</font> <font color="#000000">d</font><font color="#434f54">.</font><font color="#000000">value</font><font color="#000000">;</font><font color="#000000">}</font><font color="#000000">)</font><font color="#000000">]</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;define the line</font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">var</font> <font color="#000000">moistureline</font> <font color="#434f54">=</font> <font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">line</font><font color="#000000">(</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">x</font><font color="#000000">(</font><font color="#000000">function</font><font color="#000000">(</font><font color="#000000">d</font><font color="#000000">)</font> <font color="#000000">{</font> <font color="#5e6d03">return</font> <font color="#000000">x</font><font color="#000000">(</font><font color="#000000">d</font><font color="#434f54">.</font><font color="#d35400">time</font><font color="#000000">)</font><font color="#000000">;</font> <font color="#000000">}</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">y</font><font color="#000000">(</font><font color="#000000">function</font><font color="#000000">(</font><font color="#000000">d</font><font color="#000000">)</font> <font color="#000000">{</font> <font color="#5e6d03">return</font> <font color="#000000">y</font><font color="#000000">(</font><font color="#000000">d</font><font color="#434f54">.</font><font color="#000000">value</font><font color="#000000">)</font><font color="#000000">;</font> <font color="#000000">}</font><font color="#000000">)</font><font color="#000000">;</font>
                      
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;add path of line </font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">svg1</font><font color="#434f54">.</font><font color="#000000">append</font><font color="#000000">(</font><font color="#005c5f">&#34;path&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#d35400">data</font><font color="#000000">(</font><font color="#000000">[</font><font color="#d35400">data</font><font color="#000000">]</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;class&#34;</font><font color="#434f54">,</font> <font color="#005c5f">&#34;moistureline&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;d&#34;</font><font color="#434f54">,</font> <font color="#000000">moistureline</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                       &nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;add x-axis</font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">svg1</font><font color="#434f54">.</font><font color="#000000">append</font><font color="#000000">(</font><font color="#005c5f">&#34;g&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;class&#34;</font><font color="#434f54">,</font><font color="#005c5f">&#34;x-axis&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;transform&#34;</font><font color="#434f54">,</font> <font color="#005c5f">&#34;translate(0,&#34;</font> <font color="#434f54">+</font> <font color="#000000">height</font> <font color="#434f54">+</font><font color="#005c5f">&#34;)&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">call</font><font color="#000000">(</font><font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">axisBottom</font><font color="#000000">(</font><font color="#000000">x</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">ticks</font><font color="#000000">(</font><font color="#000000">width</font> <font color="#434f54">&#47;</font> <font color="#000000">100</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">tickFormat</font><font color="#000000">(</font><font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">timeFormat</font><font color="#000000">(</font><font color="#005c5f">&#34;%m&#47;%d&#47;%Y&#34;</font><font color="#000000">)</font><font color="#000000">)</font><font color="#434f54">.</font><font color="#000000">tickSizeOuter</font><font color="#000000">(</font><font color="#000000">0</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">&#47;&#47;add y-axis</font>
                       &nbsp;&nbsp;&nbsp;<font color="#000000">svg1</font><font color="#434f54">.</font><font color="#000000">append</font><font color="#000000">(</font><font color="#005c5f">&#34;g&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">attr</font><font color="#000000">(</font><font color="#005c5f">&#34;class&#34;</font><font color="#434f54">,</font> <font color="#005c5f">&#34;y-axis&#34;</font><font color="#000000">)</font>
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#434f54">.</font><font color="#000000">call</font><font color="#000000">(</font><font color="#000000">d3</font><font color="#434f54">.</font><font color="#000000">axisLeft</font><font color="#000000">(</font><font color="#000000">y</font><font color="#000000">)</font><font color="#000000">)</font><font color="#000000">;</font>
                       &nbsp;&nbsp;&nbsp;
                        <font color="#000000">}</font><font color="#000000">)</font><font color="#000000">;</font>
                        <font color="#434f54">&lt;</font><font color="#434f54">&#47;</font><font color="#000000">script</font><font color="#434f54">&gt;</font>`
  });
});

/* GET projects/shotchart */
router.get('/projects/shotchart', function(req, res) {
  res.render('shotchart', { title: 'shot chart' });
});

/* GET projects/censor-weibo */
router.get('/projects/censor-weibo', function(req, res) {
  res.render('censor-weibo', { title: 'censor weibo' });
});

module.exports = router;
