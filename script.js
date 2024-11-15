document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const originalImage = document.getElementById('originalImage');
    const convertedImage = document.getElementById('convertedImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.getElementById('previewContainer');
    const rotateBtn = document.getElementById('rotateBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');

    let cropper = null;

    // 拖拽相关事件处理
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        });
    });

    dropZone.addEventListener('drop', handleDrop);
    imageInput.addEventListener('change', handleFileSelect);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    initCropper(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('请上传图片文件！');
            }
        }
    }

    function initCropper(dataUrl) {
        // 销毁现有的 cropper 实例
        if (cropper) {
            cropper.destroy();
        }

        // 显示预览容器
        previewContainer.style.display = 'block';
        
        // 设置原始图片
        originalImage.src = dataUrl;

        // 初始化 cropper
        cropper = new Cropper(originalImage, {
            aspectRatio: 295 / 413,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 1,
            restore: false,
            modal: true,
            guides: true,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false,
            ready: function() {
                updatePreview();
            },
            crop: function() {
                updatePreview();
            }
        });
    }

    function updatePreview() {
        if (!cropper) return;

        const canvas = cropper.getCroppedCanvas({
            width: 295,
            height: 413,
            fillColor: '#fff'
        });

        convertedImage.src = canvas.toDataURL('image/jpeg', 0.95);
        downloadBtn.disabled = false;
    }

    // 旋转按钮事件
    rotateBtn.addEventListener('click', () => {
        if (cropper) {
            cropper.rotate(90);
        }
    });

    // 缩放按钮事件
    zoomInBtn.addEventListener('click', () => {
        if (cropper) {
            cropper.zoom(0.1);
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (cropper) {
            cropper.zoom(-0.1);
        }
    });

    // 下载按钮事件
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = '一寸照片.jpg';
        link.href = convertedImage.src;
        link.click();
    });
}); 