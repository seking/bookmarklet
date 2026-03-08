javascript: {
  const AMAZON_AFFILIATE_ID='ma-king-22'

  // 書籍名の取得
  const titleElement = document.getElementById("productTitle")
  	|| document.getElementById("ebooksProductTitle")
  	// mobile
  	|| document.getElementById("title");
  
  const title = titleElement ? titleElement.innerText.trim() : '';

  // ASIN の取得
  const asinId = document.getElementById('ASIN'); 
  const asin = asinId ? asinId.value : (document.getElementsByName('ASIN.0')?.[0]?.value);
  

  //登録情報欄を取得
  let detail = document.getElementById('detailBullets_feature_div');
  if (!detail && document.getElementById("product-description-iframe")) {
    const subdoc = document.getElementById("product-description-iframe").contentWindow.document;
    detail = subdoc.getElementById("detailBullets_feature_div");
  }
  else if (!detail) {
    // mobile
  	detail = document.getElementById('productDetails_feature_div');
  }
  

  // 出版関係の情報を取得 (ここでは出版日付だけ)
  const pubdataList = detail.innerText.split(/\n/);
  
  let publisher = '';
  let publish_date = '';
  pubdataList.forEach(item => {
  	const [label, ...valueParts] = item.split(':');
 	const value = valueParts.join(':').trim(); 
  
    if (label.includes('出版社')) {
      // 出版社情報から「;」以降とカッコ内の文字を削除
      publisher = value.replace(/;.*|\(.*?\)/g, '').trim();
    } else if (label.includes('発売日')) {
      publish_date = value.trim();
    }
  });
  

  // 書籍のタイトルとリンク貼り
  const url = `https://www.amazon.co.jp/exec/obidos/ASIN/${asin}/${AMAZON_AFFILIATE_ID}`;
  const link = `[${title}](${url})`;

  // 選択範囲を取得する
  const isSelection = window.getSelection().toString();
  const selection = isSelection ? `> [!quote] ${title}\n> ${isSelection.replace(/(\W+)( )(\W+)/g,'$1$3').replace(/\n/g,'\n> ')}` : "";

  // 書影の取得
  // const imgBlkFront = document.getElementById("imgBlkFront");
  // const ebooksImgBlkFront = document.getElementById("ebooksImgBlkFront");
  //   const imageurl = imgBlkFront ? imgBlkFront.getAttribute("src") : ebooksImgBlkFront.getAttribute("src");
  const imageElement = document.getElementById("landingImage")
    // mobile
  	|| document.getElementById("main-image");
  const imageurl = imageElement.getAttribute("src");
  // update at 2023/11/17
  const mdimage = `\n![|100](${imageurl})\n`;  
  
  // 著者情報の取得
  const authors = [];
  const viewAuthors = [];
  document.querySelectorAll('.author').forEach((c) => {
      var at = c.innerText.replace(/\r?\n/g, '').replace(/,/, '');
      var pu = at.match(/\(.+\)/);
      var ct = at.replace(/\(.+\)/, '').replace(/ /g, '');
      viewAuthors.push(`[[${ct}]]${pu}`);
      authors.push(ct);
  });
  if (authors.length == 0) {
    // mobile
  	authors.push(document.getElementById("contributorLink").innerText);
  }
const date = new Date();
const formattedDate = date.toISOString().replace('T', ' ').slice(0, 19);
  // 表示する内容
 const lines = `
 ---
 status: unread
 ownership: not
 score:
 tags: book
 title: ${title}
 authors: [${authors.join(', ')}]
 asin: ${asin}
 publisher: ${publisher}
 published: ${publish_date}
 categories:
 cover: ${imageurl}
 created: ${formattedDate}
 updated: ${formattedDate}
 ---
 
 ${link}
 ${mdimage}
 ${selection}
 ----
 # Summary
 ## Try
 
 
 `.trim().replace(/^[ \t]+/gm, '');
  
  let replaceElement = document.getElementById('bookDescription_feature_div');
  if (!replaceElement) {
    // mobile
  	replaceElement = document.getElementById('image-block-pagination-row-wrapper');
 }
 replaceElement.innerHTML = `<textarea style="height:500px">${lines}</textarea>`;
}
