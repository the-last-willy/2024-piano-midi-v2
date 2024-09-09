class Window
{
    constructor(parent)
    {
        this.html = document.createElement("div");
        parent.appendChild(this.html);

        this.html.style.position = 'absolute';
        this.html.style.minWidth = '100px';
        this.html.style.minHeight = '100px';
        this.html.style.background = 'rgb(0, 100, 0)';

        this.titlebar = document.createElement('div');
        this.html.appendChild(this.titlebar);

        this.titlebar.style.width = '100%';
        this.titlebar.style.minHeight = '20px';
        this.titlebar.style.position = 'absolute';
        this.titlebar.style.background = 'rgb(0, 0, 100)';

        this.titlebar.onmousedown

        this.closebutton = document.createElement('button');
        this.closebutton.innerHTML = 'X';
        this.closebutton.onclick = () => this.close();
        this.html.appendChild(this.closebutton);

        // dragging

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        this.titlebar.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // set the element's new position:
            this.html.style.top = (this.html.offsetTop - pos2) + "px";
            this.html.style.left = (this.html.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    close() {
        this.html.parentNode.removeChild(this.html);
    }
}

new Window(document.getElementById('body'));
