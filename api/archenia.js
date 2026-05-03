const https = require('https');
const fs = require('fs');
const path = require('path');

const validZips = new Set(
  fs.readFileSync(path.join(__dirname, '..', 'valid-zips.txt'), 'utf8')
    .trim().split('\n').map(z => z.trim())
);

const areaCodeState = {
  205:'AL',251:'AL',256:'AL',334:'AL',938:'AL',
  907:'AK',
  480:'AZ',520:'AZ',602:'AZ',623:'AZ',928:'AZ',
  479:'AR',501:'AR',870:'AR',
  209:'CA',213:'CA',279:'CA',310:'CA',323:'CA',341:'CA',350:'CA',408:'CA',415:'CA',424:'CA',442:'CA',510:'CA',530:'CA',559:'CA',562:'CA',619:'CA',626:'CA',628:'CA',650:'CA',657:'CA',661:'CA',669:'CA',707:'CA',714:'CA',747:'CA',760:'CA',805:'CA',818:'CA',820:'CA',831:'CA',840:'CA',858:'CA',909:'CA',916:'CA',925:'CA',949:'CA',951:'CA',
  303:'CO',719:'CO',720:'CO',970:'CO',
  203:'CT',475:'CT',860:'CT',959:'CT',
  302:'DE',
  202:'DC',
  239:'FL',305:'FL',321:'FL',352:'FL',386:'FL',407:'FL',561:'FL',689:'FL',727:'FL',754:'FL',772:'FL',786:'FL',813:'FL',850:'FL',863:'FL',904:'FL',941:'FL',954:'FL',
  229:'GA',404:'GA',470:'GA',478:'GA',678:'GA',706:'GA',762:'GA',770:'GA',912:'GA',943:'GA',
  808:'HI',
  208:'ID',986:'ID',
  217:'IL',224:'IL',309:'IL',312:'IL',331:'IL',447:'IL',464:'IL',618:'IL',630:'IL',708:'IL',773:'IL',779:'IL',815:'IL',847:'IL',872:'IL',
  219:'IN',260:'IN',317:'IN',463:'IN',574:'IN',765:'IN',812:'IN',930:'IN',
  319:'IA',515:'IA',563:'IA',641:'IA',712:'IA',
  316:'KS',620:'KS',785:'KS',913:'KS',
  270:'KY',364:'KY',502:'KY',606:'KY',859:'KY',
  225:'LA',318:'LA',337:'LA',504:'LA',985:'LA',
  207:'ME',
  240:'MD',301:'MD',410:'MD',443:'MD',667:'MD',
  339:'MA',351:'MA',413:'MA',508:'MA',617:'MA',774:'MA',781:'MA',857:'MA',978:'MA',
  231:'MI',248:'MI',269:'MI',313:'MI',517:'MI',586:'MI',616:'MI',734:'MI',810:'MI',906:'MI',947:'MI',989:'MI',
  218:'MN',320:'MN',507:'MN',612:'MN',651:'MN',763:'MN',952:'MN',
  228:'MS',601:'MS',662:'MS',769:'MS',
  314:'MO',417:'MO',573:'MO',636:'MO',660:'MO',816:'MO',
  406:'MT',
  308:'NE',402:'NE',531:'NE',
  702:'NV',725:'NV',775:'NV',
  603:'NH',
  201:'NJ',551:'NJ',609:'NJ',640:'NJ',732:'NJ',848:'NJ',856:'NJ',862:'NJ',908:'NJ',973:'NJ',
  505:'NM',575:'NM',
  212:'NY',315:'NY',332:'NY',347:'NY',516:'NY',518:'NY',585:'NY',607:'NY',631:'NY',646:'NY',680:'NY',716:'NY',718:'NY',838:'NY',845:'NY',914:'NY',917:'NY',929:'NY',934:'NY',
  252:'NC',336:'NC',704:'NC',743:'NC',828:'NC',910:'NC',919:'NC',980:'NC',984:'NC',
  701:'ND',
  216:'OH',220:'OH',234:'OH',283:'OH',326:'OH',330:'OH',380:'OH',419:'OH',440:'OH',513:'OH',567:'OH',614:'OH',740:'OH',937:'OH',
  405:'OK',539:'OK',580:'OK',918:'OK',
  458:'OR',503:'OR',541:'OR',971:'OR',
  215:'PA',223:'PA',267:'PA',272:'PA',412:'PA',445:'PA',484:'PA',570:'PA',582:'PA',610:'PA',717:'PA',724:'PA',814:'PA',878:'PA',
  401:'RI',
  803:'SC',843:'SC',854:'SC',864:'SC',
  605:'SD',
  423:'TN',615:'TN',629:'TN',731:'TN',865:'TN',901:'TN',931:'TN',
  210:'TX',214:'TX',254:'TX',281:'TX',325:'TX',346:'TX',361:'TX',409:'TX',430:'TX',432:'TX',469:'TX',512:'TX',682:'TX',713:'TX',726:'TX',737:'TX',806:'TX',817:'TX',830:'TX',832:'TX',903:'TX',915:'TX',936:'TX',940:'TX',956:'TX',972:'TX',979:'TX',
  385:'UT',435:'UT',801:'UT',
  802:'VT',
  276:'VA',434:'VA',540:'VA',571:'VA',703:'VA',757:'VA',804:'VA',826:'VA',948:'VA',
  206:'WA',253:'WA',360:'WA',425:'WA',509:'WA',564:'WA',
  304:'WV',681:'WV',
  262:'WI',274:'WI',353:'WI',414:'WI',534:'WI',608:'WI',715:'WI',920:'WI',
  307:'WY'
};

const stateZips = {
  'AL':['35201','35005','36101'],'AK':['99501','99701'],'AZ':['85001','85201','85701'],
  'AR':['72201','72701'],'CA':['90001','94102','92101','95814','90210'],
  'CO':['80201','80301','80901'],'CT':['06101','06501'],'DE':['19901','19801'],
  'DC':['20001','20036'],'FL':['33101','32801','33601','34201','32301'],
  'GA':['30301','31201','30901'],'HI':['96801','96813'],'ID':['83701','83201'],
  'IL':['60601','61701','62701'],'IN':['46201','46801','47201'],
  'IA':['50301','52240','51501'],'KS':['66101','67201'],'KY':['40201','40501','42101'],
  'LA':['70112','71101','70501'],'ME':['04101','04401'],'MD':['21201','20601','21401'],
  'MA':['02101','01001','01501'],'MI':['48201','49001','48601'],
  'MN':['55401','55101','56001'],'MS':['39201','38601'],'MO':['63101','64101','65801'],
  'MT':['59601','59101'],'NE':['68101','68501'],'NV':['89101','89501'],
  'NH':['03101','03301'],'NJ':['07101','08501','07001'],'NM':['87101','88001'],
  'NY':['10001','14201','12201','11501'],'NC':['27601','28201','27401'],
  'ND':['58102','58501'],'OH':['43201','44101','45201'],'OK':['73101','74101'],
  'OR':['97201','97401'],'PA':['19101','15201','17101'],'RI':['02901','02860'],
  'SC':['29201','29401'],'SD':['57101','57701'],'TN':['37201','38101','37901'],
  'TX':['75201','77001','78201','73301','79901'],'UT':['84101','84601'],
  'VT':['05401','05601'],'VA':['23219','22101','24011'],'WA':['98101','99201'],
  'WV':['25301','26501'],'WI':['53201','54901','53701'],'WY':['82001','82601']
};

const areaCodeToZip = {};
for (const [ac, state] of Object.entries(areaCodeState)) {
  const candidates = stateZips[state] || [];
  for (const zip of candidates) {
    if (validZips.has(zip)) { areaCodeToZip[ac] = zip; break; }
  }
  if (!areaCodeToZip[ac] && candidates.length > 0) {
    const prefix = candidates[0].substring(0, 2);
    for (const vz of validZips) {
      if (vz.startsWith(prefix)) { areaCodeToZip[ac] = vz; break; }
    }
  }
}

function lookupZip(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, '');
  let areaCode;
  if (digits.length === 11 && digits.startsWith('1')) areaCode = digits.substring(1, 4);
  else if (digits.length === 10) areaCode = digits.substring(0, 3);
  else { const clean = digits.replace(/^1/, ''); areaCode = clean.substring(0, 3); }
  return areaCodeToZip[areaCode] || null;
}

function fetchArchenia(callerId, zip) {
  return new Promise((resolve, reject) => {
    const url = `https://services.archenia.io/mcm/listings?partnerId=tovk8na8&searchType=keywordOrBusiness&searchTerm=pest%20control%20services&callerId=${encodeURIComponent(callerId)}&zip=${encodeURIComponent(zip)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

module.exports = async (req, res) => {
  const callerId = req.query.callerId || '';
  if (!callerId) return res.json([]);

  const zip = lookupZip(callerId);
  if (!zip) return res.json([]);

  try {
    const result = await fetchArchenia(callerId, zip);
    res.setHeader('Content-Type', 'application/json');
    res.send(result.body);
  } catch (err) {
    res.json([]);
  }
};
