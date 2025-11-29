import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './CKEditer.scss';

// Custom Upload Adapter sử dụng fetch (cho upload ảnh)
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) => new Promise((resolve, reject) => {
        // Validation đơn giản: Chỉ cho phép image
        if (!file.type.startsWith('image/')) {
          reject('Chỉ hỗ trợ file ảnh (jpg, png, gif, etc.)');
          return;
        }

        const formData = new FormData();
        formData.append('upload', file); 

        fetch('http://localhost:3000/api/v1/admin/upload-cloud-image', { 
          method: 'POST',
          body: formData,
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Upload thất bại: ${response.statusText}`);
            }
            return response.json();
          })
          .then((uploadRes) => {
            let imageUrl = '';
            if (uploadRes.url) {
              imageUrl = uploadRes.url; // Khớp với backend: { url: secure_url }
            } else if (uploadRes.urls && uploadRes.urls.length > 0) {
              imageUrl = uploadRes.urls[0]; // Fallback cho multiple mode (lấy đầu tiên)
            } else if (Array.isArray(uploadRes) && uploadRes[0]?.url) {
              imageUrl = uploadRes[0].url; // Fallback nếu array
            }
            
            if (!imageUrl) {
              throw new Error('Upload thất bại: Không có URL trả về từ server');
            }

            // Prefix nếu relative (nhưng Cloudinary secure_url thường là full HTTPS)
            const baseHost = process.env.REACT_APP_API_HOST || 'http://localhost:3000';
            if (!imageUrl.startsWith('http')) {
              imageUrl = `${baseHost}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
            }

            resolve({
              default: imageUrl,
            });
          })
          .catch((error) => {
            console.error('Lỗi upload ảnh:', error);
            reject(error.message);
          });
      })
    );
  }

  abort() {
    console.log('Upload ảnh bị hủy');
  }
}

// Plugin để kích hoạt upload adapter
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const MyEditor = ({ value, onChange }) => { 
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value || ''} 
      onReady={(editor) => {
        // console.log('CKEditor đã sẵn sàng!');
        // Kích hoạt upload adapter (uncomment nếu dùng upload ảnh)
        MyCustomUploadAdapterPlugin(editor);
      }}
      onChange={(_, editor) => {
        const newData = editor.getData(); 
        onChange(newData); 
      }}
      onError={(error, { willEditorRestart }) => {
        // Xử lý lỗi editor (tùy chọn)
        console.error('Lỗi CKEditor:', error);
        if (willEditorRestart) {
          console.log('Editor sẽ restart...');
        }
      }}
      config={{
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'underline', 'strikethrough', '|',
          'link', '|',
          'bulletedList', 'numberedList', '|',
          'outdent', 'indent', '|',
          'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|',
          'undo', 'redo'
        ],
        // Placeholder nếu cần: placeholder: 'Nhập mô tả...',
      }}
    />
  );
};

export default MyEditor;