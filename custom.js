/*jshint esversion: 6 */
try{
let log = s =>{
    let tgt = document.getElementById('open-modal')?.getElementsByClassName('js-med-tweet med-tweet')[0]?.getElementsByClassName('js-tweet-text tweet-text')[0];
    if(tgt) tgt.innerText = s;
};
document.addEventListener('keydown', e => {
    let tgt = e.target;
    if(
        tgt.tagName === 'TEXTAREA'
    &&  (e.key === 'ArrowLeft' && !e.shiftKey && !tgt.selectionStart && !tgt.selectionEnd)
    ||  (e.key === 'ArrowRight' && !e.shiftKey && tgt.selectionStart === tgt.value.length && tgt.selectionEnd === tgt.value.length)
    )
        e.preventDefault();
}, {passive:false});
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
    }catch(err){alert(err.stack);}});
}catch(err){alert(err.stack);}});
document.querySelector('.js-drawer.drawer[data-drawer=\'compose\']').addEventListener('DOMNodeRemoved', function(e){try{
    if(e.relatedNode.className.match('js-reply-info-container')){
        document.getElementsByClassName('js-account-list')[0].style.top = '';
        document.querySelector('.js-account-safeguard-checkbox ~ .cf').style.top = '';
    }
    if(this != e.relatedNode) return;
    /* 閉じたら */
}catch(err){alert(err.stack);}});
document.getElementById('open-modal').addEventListener('DOMNodeInserted', function(e){try{
    if(this != e.relatedNode) return;
    if(this.getElementsByClassName('mdl-inner').length) return;
    let outer = this, imgElm, touchElm, textElm, scrollDiv, moveImg, moveRect = ()=>moveImg.getBoundingClientRect(), sizeElm, hideUI = false, leftBtn, rightBtn, hideElm,
        MINZOOM = 0.9, touches = {}, _zoom=1, pos={x:0,y:0}, IMG_GAP=30, WIDTH, HEIGHT, offset, scrollX, selectedImg, imgHeight, imgWidth, canMove = true, canZoom = false, animDelay=[], vx=0, vy = 0, vReset=0, longtap;
    let setElmPos = (tgt, x, y) => {
        if(x || x===0) tgt.style.left = `${x}px`;
        if(y || y===0) tgt.style.top = `${y}px`;
    },
    setImgPos = (x, y) => {
        setElmPos(moveImg, (x || x===0)?(offset+x):null, y);
    },
    scrollTo = x =>{
        scrollX = x;
        scrollDiv.style.left = `-${scrollX}px`;
    },
    zoom = z =>{
        if(z>1) _zoom = Math.max(_zoom, MINZOOM);
        _zoom *= z;
        moveImg.style.transform = `scale(${Math.max(_zoom, MINZOOM)})`;
        return _zoom;
    },
    checkPos = (moveX, moveY, rect=undefined) => {
        let {x, y, right, bottom, width, height} = rect||moveRect(), ratio = imgWidth/imgHeight;
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
    scrollBy = x =>{
        scrollTo(scrollX + x);
    },
    getImgOffset = index => imgArr.length>1?(index+1)*(WIDTH+IMG_GAP):0,
    scrollImg = (dir, smooth) => {
        let duration;
        moveImg = document.getElementsByClassName('img-scroll-inner')[(selectedImg+dir+imgArr.length)%imgArr.length+(imgArr.length>1)];
        selectedImg += dir;
        sizeElm.src = 'https:/'+`/pbs.twimg.com/media/${imgArr[(selectedImg+imgArr.length)%imgArr.length]}?format=${typeArr[(selectedImg+imgArr.length)%imgArr.length]}&name=large`;
        if(smooth){
            canMove = false;
            let move = Math.abs((getImgOffset(selectedImg))-scrollX);
            duration = Math.round(Math.sqrt(move/(WIDTH+IMG_GAP))*15)/100;
            scrollDiv.style.transition = `left ${duration}s ease-out`;
            scrollTo(getImgOffset(selectedImg));
            selectedImg = (selectedImg+imgArr.length)%imgArr.length;
            offset = getImgOffset(selectedImg);
            let timeout = setTimeout(()=>{try{
                animDelay.splice(animDelay.indexOf(timeout), 1);
                canMove = true;
                scrollDiv.style.transition = '';
                scrollTo(offset);
            }catch(err){alert(e.stack);}}, duration*1000);
            animDelay.push(timeout);
        } else {
            selectedImg = (selectedImg+imgArr.length)%imgArr.length;
            offset = getImgOffset(selectedImg);
            scrollTo(offset);
        }
    },
    resetSelectedImagePos = (resetZoom, smooth) => {
        if(resetZoom){
            _zoom = 1;
            zoom(1);
        }
        let duration;
        if(smooth){
            canMove = false;
            duration =  Math.round(Math.sqrt(pos.y/(WIDTH+IMG_GAP))*15)/100;
            moveImg.style.transition = `top ${duration}s linear`;
            let timeout = setTimeout(()=>{try{
                canMove = true;
                animDelay.splice(animDelay.indexOf(timeout), 1);
                moveImg.style.transition = '';
            }catch(err){alert(e.stack);}}, duration*1000);
            animDelay.push(timeout);
        }
        pos = {x:0, y:0};
        setImgPos(0, 0);
        scrollImg(0, smooth);
    },
    click,
    touchstart = e =>{
        try{
            clearTimeout(longtap);
            if(e.touches.length === 1){
                click = {x:e.touches[0].clientX, y:e.touches[0].clientY};
                longtap = setTimeout(()=>{try{
                    outer.getElementsByClassName('js-media-image-link')[0].click();
                }catch(err){alert(err.stack);}}, 500);
            } else click = undefined;
            for(const touch of e.changedTouches){
                touches[touch.identifier] = {
                    x: touch.clientX,  
                    y: touch.clientY,
                };
            }
            vx=0; vy=0; vReset = Date.now();
            if(_zoom === 1 && e.touches.length === 2) resetSelectedImagePos(true, true);
        }catch(err){alert(err.stack);}
    },
    touchmove = e =>{
        if(outer.innerHTML === '') return;
        click = undefined;
        if(!canMove) return;
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
                }catch(err){alert(err.stack);}}, 250);
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
                    resetSelectedImagePos(false, false);
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
        }catch(err){alert(err.stack);}
    },
    switchHideUI = ()=>{
        try{
            hideUI = !hideUI;
            for(const el of hideElm)
                el.style.setProperty('display', hideUI?'none':'', 'important');
        }catch(err){alert(err.stack);}
    },
    dblClickTimeout,
    touchend = e =>{try{
        clearTimeout(longtap);
        if(click){
            if(e.target.className !== 'img-scroll-inner') return;
            if(!canMove) return;
            clearTimeout(dblClickTimeout);
            switchHideUI();
            if(dblClickTimeout === undefined){
                dblClickTimeout = setTimeout(()=>{try{
                    dblClickTimeout = undefined;
                }catch(err){alert(err.stack);}}, 250);
            } else {
                let duration;
                if(_zoom < 1.5){
                    duration = Math.sqrt(2-_zoom)*0.08;
                    canMove = false;
                    moveImg.style.transition = `transform ${duration}s linear, left ${duration}s linear, top ${duration}s linear`;
                    pos.x -= click.x-WIDTH/2;
                    if(imgHeight/imgWidth*WIDTH*2 > HEIGHT){
                        let rect = moveRect();
                        pos.y -= checkPos(click.x-WIDTH/2, click.y-HEIGHT/2, new DOMRect(
                            rect.x-rect.width/2,
                            rect.y-rect.height/2,
                            rect.width*2,
                            rect.height*2
                        )).y;
                    }
                    _zoom = 2;
                    zoom(1);
                    setImgPos(pos.x, pos.y);
                } else {
                    duration = Math.sqrt(_zoom-1)*0.08;
                    canMove = false;
                    moveImg.style.transition = `transform ${duration}s linear, left ${duration}s linear, top ${duration}s linear`;
                    resetSelectedImagePos(true, false);
                }
                let timeout = setTimeout(()=>{try{
                    canMove = true;
                    animDelay.splice(animDelay.indexOf(timeout), 1);
                    moveImg.style.transition = '';
                }catch(err){alert(err.stack);}}, duration*1000);
                animDelay.push(timeout);
                dblClickTimeout = undefined;
            }
            return;
        }
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
                resetSelectedImagePos(true, true);
        } else if (e.touches.length <= 1 && _zoom < 1){
            canMove = false;
            _zoom = MINZOOM;
            moveImg.style.transition = 'transform 0.03s linear';
            let timeout = setTimeout(()=>{try{
                animDelay.splice(animDelay.indexOf(timeout), 1);
                canMove = true;
                moveImg.style.transform = '';
            }catch(err){alert(err.stack);}});
            animDelay.push(timeout);
            _zoom = 1; zoom(1);
        }
        }catch(err){alert(err.stack);}
    },
    scrollBtnClick = dir =>{
        try{
            scrollDiv.style.transition='';
            resetSelectedImagePos(true, false);
            for(const t of animDelay) clearTimeout(t);
            animDelay = [];
            canMove = true;
            vx=0; vy=0; vReset = Date.now();
            scrollImg(dir);
            return false;
        }catch(err){alert(err.stack);}
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
                                }catch(err){alert(err.stack);}}, 7);
                            }else{
                                canMove = true;
                                setVideoPos(0);
                            }
                            }catch(err){alert(err.stack);}
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
                }catch(err){alert(err.stack);}
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
                    }catch(err){alert(err.stack);}}, 250);
                    videoY += moveY;
                    if(Math.abs(videoY) >= 30)
                        setVideoPos(videoY);
                    oldY = touch.clientY;
                }
                }catch(err){alert(err.stack);}
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
                    }catch(err){alert(err.stack);}
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
        scrollTo(getImgOffset(selectedImg));
        for(let i=-multi; i<imgArr.length+multi; i++){
            let inner = document.createElement('div');
            inner.className = 'img-scroll-inner';
            inner.style.width = `${WIDTH}px`;
            inner.style.height = `${HEIGHT}px`;
            inner.style.backgroundImage = 'url(\"https:/'+`/pbs.twimg.com/media/${imgArr[(i+imgArr.length)%imgArr.length]}?format=${typeArr[(i+typeArr.length)%typeArr.length]}&name=large\")`;
            inner.addEventListener('click', click);
            setElmPos(inner, getImgOffset(i), 0);
            frag.appendChild(inner);
            if(i === selectedImg){
                moveImg = inner;
                offset = getImgOffset(i);
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
        outer.getElementsByClassName('mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media')[0].addEventListener('click', function f(){try{
            this.removeEventListener('click', f);
            leftBtn.removeEventListener('click', leftBtnClick);
            rightBtn.removeEventListener('click', rightBtnClick);
            let inner = document.getElementsByClassName('img-scroll-inner');
            while(inner.length){
                inner[0].removeEventListener('click', click);
            }
            touchElm.removeEventListener('touchstart', touchstart);
            for(const evName of ['touchend', 'touchcancel']){
                touchElm.removeEventListener(evName, touchend);
            }
            touchElm.removeEventListener('touchmove', touchmove);
        }catch(err){alert(err.stack);}});
    }catch(err){alert(err.stack);}});
}catch(err){alert(err.stack);}});
document.addEventListener('click', function(e){try{
    let tgt = e.target;
    if(tgt.className.match('js-media-image-link') && !tgt.getElementsByClassName('video-overlay').length && !tgt.getElementsByTagName('img').length){
        imgArr = [];
        for(const el of tgt.parentNode.parentNode.getElementsByClassName('js-media-image-link')){
            imgArr.push(getImgID(el.style.backgroundImage));
            typeArr.push(el.style.backgroundImage.match(/format=[a-zA-Z]+/)[0]?.replace('format=', '')||el.style.backgroundImage.match(/\/media\/[a-zA-Z\d]+\.[a-zA-Z]+/)[0].split('.')[1]);
        }
    }
}catch(err){alert(err.stack);}});
}catch(err){alert(err.stack);}