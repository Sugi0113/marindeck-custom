/*jshint esversion: 6 */
/* 改行が削除されるので、//は使わない */
try{
let log = s =>{
    let tgt = document.getElementById('open-modal')?.getElementsByClassName('js-med-tweet med-tweet')[0]?.getElementsByClassName('js-tweet-text tweet-text')[0];
    if(tgt) tgt.innerText = s;
};
let getImgID = s => s.match(/\/media\/[\w\-]+/)[0].replace('/media/','');
var imgArr = [], typeArr = [];
document.querySelector('.js-drawer.drawer[data-drawer=\'compose\']').addEventListener('DOMNodeInserted', function(e){try{
    if(this != e.relatedNode) return;
    setImmediate(function(){try{
        if(document.getElementsByClassName('js-in-reply-to compose-reply-tweet')[0].className.match(/ is-hidden$/)){
            /* ツイート */
            
        }else{/* リプライ *
            /* ツイートボタンと垢一覧の位置を 返信先ツイの高さに応じて調整 */
            document.getElementsByClassName('js-account-list')[0].style.top = `${document.getElementsByClassName('position-rel compose-text-container')[0].getBoundingClientRect().bottom - 63}px`;
            document.querySelector('.js-account-safeguard-checkbox ~ .cf').style.top = `${document.getElementsByClassName('position-rel compose-text-container')[0].getBoundingClientRect().bottom + 11}px`;
            /* リプライ画面から＋ボタンでツイート画面に移ったら */
            document.getElementsByClassName('js-in-reply-to compose-reply-tweet')[0].addEventListener('DOMNodeRemoved', function(e){
                /* 位置をリセット */
                document.getElementsByClassName('js-account-list')[0].style.top = '';
                document.querySelector('.js-account-safeguard-checkbox ~ .cf').style.top = '';
                /* 返信先IDの表示を削除 */
                document.getElementsByClassName('js-reply-info-container')[0].getElementsByTagName('div')[0].removeElm();
                document.getElementsByClassName('js-reply-info-container')[0].className += 'is-hidden';
            });
        }
    }catch(e){alert(e.stack);}});
}catch(e){alert(e.stack);}});
document.querySelector('.js-drawer.drawer[data-drawer=\'compose\']').addEventListener('DOMNodeRemoved', function(e){try{
    if(e.relatedNode.className.match('js-reply-info-container')){
        document.getElementsByClassName('js-account-list')[0].style.top = '';
        document.querySelector('.js-account-safeguard-checkbox ~ .cf').style.top = '';
    }
    if(this != e.relatedNode) return;
    /* 閉じたら */
}catch(e){alert(e.stack);}});
document.getElementById('open-modal').addEventListener('DOMNodeInserted', function(e){try{
    if(this != e.relatedNode) return;
    let outer = this, imgElm, touchElm, textElm, scrollDiv, moveImg, moveRect = function(){return moveImg.getBoundingClientRect();}, sizeElm, hideUI = false, leftBtn, rightBtn, hideElm,
        MINZOOM = 0.9, touches = {}, _zoom=1, pos={x:0,y:0}, WIDTH, HEIGHT, offset, scrollX, selectedImg, imgHeight, imgWidth, canMove = true, canZoom = false, animDelay, vx=0, vy = 0, vReset=0, longtap;
    let setElmPos = function(tgt, x, y){
        if(x || x===0) tgt.style.left = `${x}px`;
        if(y || y===0) tgt.style.top = `${y}px`;
    },
    setImgPos = function(x, y){
        setElmPos(moveImg, (x || x===0)?(offset+x):null, y);
    },
    scrollTo = function(x){
        scrollX = x;
        scrollDiv.style.left = `-${scrollX}px`;
    },
    zoom = function(z){
        if(z>1) _zoom = Math.max(_zoom, MINZOOM);
        _zoom *= z;
        moveImg.style.transform = `scale(${Math.max(_zoom, MINZOOM)})`;
        return _zoom;
    },
    resetSelectedImagePos = function(resetZoom){
        if(resetZoom){
            _zoom = 1;
            zoom(1);
        }
        pos = {x:0, y:0};
        setImgPos(0, 0);
        scrollTo(offset);
    },
    checkPos = function(moveX, moveY){
        let {x, y, right, bottom, width, height} = moveRect(), ratio = imgWidth/imgHeight;
        if(ratio > width/height){
            y += (height-width/ratio)/2;
            bottom -= (height-width/ratio)/2;
            height = width/ratio;
        } else if(ratio < width/height){
            x += (width-height*ratio)/2;
            right -= (width-height*ratio)/2;
            width = height*ratio;
        }
        moveX = (width <= WIDTH)?0:Math.max(WIDTH-right, Math.min(-x, moveX));
        moveY = (height <= HEIGHT)?0:Math.max(HEIGHT-bottom, Math.min(-y, moveY));
        return {x:moveX, y:moveY};
    },
    scrollBy = function(x){
        scrollTo(scrollX + x);
    },
    scrollImg = function(dir, smooth){
        let duration;
        moveImg = document.getElementsByClassName('img-scroll-inner')[(selectedImg+dir+imgArr.length)%imgArr.length+(imgArr.length>1)];
        selectedImg += dir;
        sizeElm.src = 'https:/'+`/pbs.twimg.com/media/${imgArr[(selectedImg+imgArr.length)%imgArr.length]}?format=${typeArr[(selectedImg+imgArr.length)%imgArr.length]}&name=large`;
        if(smooth){
            let move = Math.abs((selectedImg+1)*(WIDTH+30)-scrollX);
            duration = Math.round(Math.sqrt(move/(WIDTH+30))*10)/100;
            canMove = false;
            scrollDiv.style.transition = `left ${duration}s ease-out`;
        }
        scrollTo((selectedImg+1)*(WIDTH+30));
        selectedImg = (selectedImg+imgArr.length)%imgArr.length;
        offset = (selectedImg+1)*(WIDTH+30);            
        if(smooth) animDelay = setTimeout(()=>{try{
            scrollDiv.style.transition = '';
            scrollTo(offset);
            canMove = true;
        }catch(e){alert(e.stack);}}, duration*1100);
    },
    switchHideUI = function(){
        try{
            hideUI = !hideUI;
            for(const el of hideElm)
                el.style.setProperty('display', hideUI?'none':'', 'important');
        }catch(e){alert(e.stack);}
    }, 
    touchstart = function(e){
        try{
            clearTimeout(longtap);
            if(e.touches.length === 1)
                longtap = setTimeout(()=>{try{
                    outer.getElementsByClassName('js-media-image-link')[0].click();
                }catch(e){alert(e.stack);}}, 500);
            for(const touch of e.changedTouches){
                touches[touch.identifier] = {
                    x: touch.clientX,  
                    y: touch.clientY,
                };
            }
            if(_zoom === 1 && e.touches.length === 2) resetSelectedImagePos(true);
        }catch(e){alert(e.stack);}
    },
    touchend = function(e){
        try{
        clearTimeout(longtap);
        for(const touch of e.changedTouches){
            if(touches[touch.identifier]) delete touches[touch.identifier];
        }
        if(e.touches.length === 0 && _zoom === 1 && canMove){
            if(Math.abs(pos.y + vy/0.5) > 100 && (Math.abs(pos.y)>=30 || (vy&&!vx) || Math.abs(Math.atan2(vy, vx)%(Math.PI) - Math.PI/2) < Math.PI/5)){
                let btn = outer.getElementsByClassName('mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media')[0];
                if(btn) btn.click();
                outer.innerHTML = '';
                outer.style.display = 'none';
            }else if(imgArr.length > 1 && Math.abs(scrollX-offset - vx*3) > WIDTH/2 && (scrollX!=offset || (vx&&!vy) || Math.abs((Math.atan2(vy, vx)+Math.PI/2)%(Math.PI) - Math.PI/2) < Math.PI/7)){
                scrollImg((scrollX-offset - vx*3)>0?1:-1, true);
            }else
                scrollImg(0, true);
        } else if (e.touches.length <= 1 && _zoom < 1){
            canMove = false;
            _zoom = MINZOOM;
            void function f(){
                try{
                _zoom = Math.min(_zoom+0.02, 1);
                moveImg.style.transform = `scale(${_zoom})`;
                if(_zoom < 1) setTimeout(() => {try{
                        f();
                    }catch(e){alert(e.stack);}}, 5);
                else {
                    zoom(1);
                    canMove = true;
                }
                }catch(e){alert(e.stack);}
            }();
        }
        }catch(e){alert(e.stack);}
    },
    touchmove = function(e){
        if(outer.innerHTML === '' || !canMove) return;
        try{
            clearTimeout(longtap);
            if(e.touches.length === 1){/* 移動 */
                let touch = e.touches[0], oldTouch = touches[touch.identifier];
                if(!oldTouch) return;
                let moveX = touch.clientX - oldTouch.x, moveY = touch.clientY - oldTouch.y;
                vx += moveX;
                vy += moveY;
                let t = Date.now();
                setTimeout(()=>{try{
                    if(vReset < t){
                        vx -= moveX;
                        vy -= moveY;
                    }
                }catch(e){alert(e.stack);}}, 250);
                if(_zoom == 1){
                    if(scrollX===offset && (pos.y || (moveY&&!moveX) || Math.abs(Math.abs(Math.atan2(moveY, moveX)) - Math.PI/2) < Math.PI/7)){
                        pos.y += moveY;
                        if(Math.abs(pos.y) >= 30){
                            setImgPos(null, pos.y);
                        }
                    }else if(imgArr.length>1 && !pos.y && (pos.x || (moveX&&!moveY) || Math.abs(Math.abs(Math.atan2(moveY, moveX)) - Math.PI/2) > Math.PI/3))
                        scrollBy(-moveX);
                }else{
                    let {x, y} = checkPos(moveX, moveY);
                    pos.x += x;
                    pos.y += y;
                    setImgPos(pos.x, pos.y);
                }
            }
            if(canZoom &&  e.touches.length === 2 && (_zoom > 1 || (!pos.x&&!pos.y))){/* ズーム */
                vy = 0; vx=0; vReset = Date.now();
                let newTouches = e.touches;
                if(!touches[newTouches[0].identifier] || !touches[newTouches[1].identifier]) return;
                let _moveX = newTouches[0].clientX + newTouches[1].clientX - touches[newTouches[0].identifier].x - touches[newTouches[1].identifier].x;
                let _moveY = newTouches[0].clientY + newTouches[1].clientY - touches[newTouches[0].identifier].y - touches[newTouches[1].identifier].y;
                let deltaZoom = Math.hypot(newTouches[0].clientX-newTouches[1].clientX, newTouches[0].clientY-newTouches[1].clientY)/Math.hypot(touches[newTouches[0].identifier].x-touches[newTouches[1].identifier].x, touches[newTouches[0].identifier].y-touches[newTouches[1].identifier].y);
                if(zoom(deltaZoom) <= 1){
                    resetSelectedImagePos();
                }else{
                    let {x, y} = checkPos(_moveX, _moveY);
                    pos.x += x;
                    pos.y += y;
                    setImgPos(pos.x, pos.y);
                }
            }
            for(const touch of e.changedTouches){
                touches[touch.identifier].x = touch.clientX;
                touches[touch.identifier].y = touch.clientY;
            }
        }catch(e){alert(e.stack);}
    },
    scrollBtnClick = function(dir){
        try{
            scrollDiv.style.transition='';
            resetSelectedImagePos(true);
            clearTimeout(animDelay);
            canMove = true;
            vx=0; vy=0; vReset = Date.now();
            scrollImg(dir);
            return false;
        }catch(e){alert(e.stack);}
    },
    rightBtnClick = ()=>scrollBtnClick(1),
    leftBtnClick = ()=>scrollBtnClick(-1);
    setImmediate(function f(){try{
        touchElm = outer.getElementsByClassName('js-embeditem med-embeditem')[0];
        textElm = outer.getElementsByClassName('js-med-tweet med-tweet')[0];
        WIDTH = touchElm.getBoundingClientRect().width;
        HEIGHT = textElm.getBoundingClientRect().bottom;
        imgElm = outer.querySelector('.l-table img.media-img');
        if(!imgElm){
            let video = outer.getElementsByTagName('video')[0];
            if(!video) return;
            setImmediate(()=>video.play(), 100);
            video.style.position = 'relative';
            video.style.height = `${HEIGHT}px`;
            let oldY, v=0, videoY = 0, videoOffset = -video.getBoundingClientRect().top;
            video.style.top = `${videoOffset}px`;
            textElm.style.display = 'none';
            setTimeout(()=>alert(textElm.getBoundingClientRect().bottom), 1000);
            let setVideoPos = y=>{videoY=y; video.style.top = `${videoOffset+videoY}px`;},
                moveVideoPos = y=>{videoY+=y; video.style.top = `${videoOffset+videoY}px`;},
                resetVideoPos = smooth =>{
                    if(smooth){
                        canMove = false;
                        void function f(move){
                            try{
                            if(Math.abs(move) < Math.abs(videoY)){
                                moveVideoPos(move);
                                setTimeout(()=>{try{
                                    f(move);
                                }catch(e){alert(e.stack);}}, 7);
                            }else{
                                canMove = true;
                                setVideoPos(0);
                            }
                            }catch(e){alert(e.stack);}
                        }(-videoY/3);
                    }else{
                        setVideoPos(0);
                    }
                };
            touchElm.addEventListener('touchstart', e => {
                try{
                if(e.touches.length == 1){
                    let touch = e.touches[0];
                    oldY = touch.clientY;
                }else if(canMove && e.touches.length == 2) {
                    resetVideoPos(true);
                }
                }catch(e){alert(e.stack);}
            });
            touchElm.addEventListener('touchmove', e=>{
                try{
                if(e.touches.length === 1){/* 移動 */
                    let touch = e.touches[0];
                    if(oldY == void(0)) return;
                    let moveY = touch.clientY - oldY;
                    v += moveY;
                    let t = Date.now();
                    setTimeout(()=>{try{
                        if(vReset < t){
                            v -= moveY;
                        }
                    }catch(e){alert(e.stack);}}, 250);
                    videoY += moveY;
                    if(Math.abs(videoY) >= 30)
                        setVideoPos(videoY);
                    oldY = touch.clientY;
                }
                }catch(e){alert(e.stack);}
            });
            for(const evName of ['touchend', 'touchcancel']){
                touchElm.addEventListener(evName, e=>{
                    try{
                    if(e.touches.length === 0){
                        if(Math.abs(videoY + v/0.5) > 100 && Math.abs(videoY)>=30){
                            let btn = outer.getElementsByClassName('mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media')[0];
                            if(btn) btn.click();
                            outer.innerHTML = '';
                            outer.style.display = 'none';
                        }else
                            resetVideoPos(true);
                    }else if(e.touches.length === 1)
                        oldY = e.touches[0].clientY;
                    }catch(e){alert(e.stack);}
                });
            }
            return;
        }
        selectedImg = imgArr.indexOf(getImgID(imgElm.src));
        if(selectedImg === -1){
            alert('Warn `selectedImg == -1`\n' + imgArr.join('\n') + '\n\n' + getImgID(imgElm.src));
            selectedImg = 0;
        }
        leftBtn = outer.getElementsByClassName('js-media-gallery-prev')[0];
        rightBtn = outer.getElementsByClassName('js-media-gallery-next')[0];
        textElm.getElementsByClassName('js-tweet-text')[0].innerHTML = textElm.getElementsByClassName('js-tweet-text')[0].innerHTML.replace(/\n/g, '<br>');
        scrollDiv = document.createElement('div');
        scrollDiv.className = 'img-scroll-outer';
        hideElm = [leftBtn, rightBtn, textElm, outer.getElementsByClassName('mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media')[0]];

        let frag = document.createDocumentFragment(), multi = +(imgArr.length>1);
        leftBtn.addEventListener('click', leftBtnClick);
        rightBtn.addEventListener('click', rightBtnClick);
        scrollTo((selectedImg+multi)*(WIDTH+30));
        for(let i=-multi; i<imgArr.length+multi; i++){
            let inner = document.createElement('div');
            inner.className = 'img-scroll-inner';
            inner.style.width = `${WIDTH}px`;
            inner.style.height = `${HEIGHT}px`;
            inner.style.backgroundImage = 'url(\"https:/'+`/pbs.twimg.com/media/${imgArr[(i+imgArr.length)%imgArr.length]}?format=${typeArr[(i+typeArr.length)%typeArr.length]}&name=large\")`;
            inner.addEventListener('click', switchHideUI);
            setElmPos(inner, (i+multi)*(WIDTH+30), 0);
            frag.appendChild(inner);
            if(i === selectedImg){
                moveImg = inner;
                offset = (i+multi)*(WIDTH+30);
            }
        }
        scrollDiv.appendChild(frag);
        frag = document.createDocumentFragment();
        sizeElm = document.createElement('img');
        sizeElm.className = 'img-size-elm';
        sizeElm.onload = ()=>{
            let rect = sizeElm.getBoundingClientRect();
            imgWidth = rect.width;
            imgHeight = rect.height;
            canZoom = true;
        };
        sizeElm.src = 'https:/'+`/pbs.twimg.com/media/${imgArr[selectedImg]}?format=${typeArr[selectedImg]}&name=large`;
        frag.appendChild(scrollDiv);
        frag.appendChild(sizeElm);
        touchElm.insertBefore(frag, touchElm.getElementsByClassName('l-table')[0]);
        _zoom = 1;
        zoom(1);
        switchHideUI();
        for(const el of hideElm) el.style.opacity = '1';
        touchElm.addEventListener('touchstart', touchstart);
        for(const evName of ['touchend', 'touchcancel']){
            touchElm.addEventListener(evName, touchend);
        }
        touchElm.addEventListener('touchmove', touchmove);
        outer.getElementsByClassName('mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media')[0].addEventListener('click', function f(){
            try{
                this.removeEventListener('click', f);
                leftBtn.removeEventListener('click', leftBtnClick);
                rightBtn.removeEventListener('click', rightBtnClick);
                let inner = document.getElementsByClassName('img-scroll-inner');
                while(inner.length){
                    inner[0].removeEventListener('click', switchHideUI);
                }
                touchElm.removeEventListener('touchstart', touchstart);
                for(const evName of ['touchend', 'touchcancel']){
                    touchElm.removeEventListener(evName, touchend);
                }
                touchElm.removeEventListener('touchmove', touchmove);
            }catch(e){alert(e.stack);}
        });
    }catch(e){alert(e.stack);}});
}catch(e){alert(e.stack);}});
document.addEventListener('click', function(e){try{
    let tgt = e.target;
    if(tgt.className === 'media-img' && tgt.parentElement.className.match('js-media-image-link')){
        alert(`このif文ってどういうとき入るんだっけ？\nclassName: ${tgt.className}`);
        alert(`${tgt.src}\n${tgt.tagName} ${tgt.className}`);
        imgArr = [getImgID(tgt.src)];
        typeArr = [tgt.src.match(/format=[a-zA-Z]+/)[0].replace('format=', '')];
    }else if(tgt.className.match('js-media-image-link') && !tgt.getElementsByTagName('img')[0]){
        imgArr = [];
        for(const el of tgt.parentNode.parentNode.getElementsByClassName('js-media-image-link')){
            try{
                imgArr.push(getImgID(el.style.backgroundImage));
            }catch(e){
                
            }
            typeArr.push(el.style.backgroundImage.match(/format=[a-zA-Z]+/)[0]?.replace('format=', '')||el.style.backgroundImage.match(/\/media\/[a-zA-Z\d]+\.[a-zA-Z]+/)[0].split('.')[1]);
        }
    }
}catch(e){alert(e.stack);}});
}catch(e){alert(e.stack);}