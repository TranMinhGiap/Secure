import { useState, useEffect } from 'react';
import { Upload, message, Progress, Popconfirm, Button, Image, Space } from 'antd';
import { EyeOutlined, DeleteOutlined, CameraOutlined, CloudUploadOutlined } from '@ant-design/icons';

const UploadAvatar = ({ value = '', onChange, uploading: externalUploading = false, url }) => {
  const [file, setFile] = useState(null);
  const [internalUploading, setInternalUploading] = useState(externalUploading);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (!value) {
      setFile(null);
      return;
    }
    setFile({
      uid: 'avatar',
      name: value.split('/').pop() || 'avatar.jpg',
      status: 'success',
      url: value,
      percent: 100,
    });
  }, [value]);

  const handleUpload = async ({ file: uploadedFile, onSuccess, onError }) => {
    const newFile = { uid: 'avatar', name: uploadedFile.name, status: 'uploading', percent: 0 };
    setFile(newFile);

    const interval = setInterval(() => {
      setFile(prev => ({
        ...prev,
        percent: Math.min((prev.percent || 0) + 10, 90),
      }));
    }, 300);

    setInternalUploading(true);
    const formData = new FormData();
    formData.append('upload', uploadedFile);

    try {
      const res = await fetch(`${url}`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload thất bại: ${res.statusText}`);
      const data = await res.json();
      let imageUrl = data.url || (data.urls?.length ? data.urls[0] : '');
      if (!imageUrl) throw new Error('Không có URL từ server');
      const baseHost = process.env.REACT_APP_API_HOST || 'http://localhost:3000';
      if (!imageUrl.startsWith('http')) {
        imageUrl = `${baseHost}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
      clearInterval(interval);
      setFile({ ...newFile, status: 'success', url: imageUrl, percent: 100 });
      onChange && onChange(imageUrl);
      onSuccess && onSuccess({ url: imageUrl });
      message.success('Tải ảnh thành công!');
    } catch (err) {
      clearInterval(interval);
      setFile({ ...newFile, status: 'error', percent: 0 });
      onError && onError(err);
      message.error(`Tải ảnh thất bại: ${err.message}`);
    } finally {
      setInternalUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onChange && onChange('');
    message.success('Đã xóa ảnh!');
  };

  const renderAvatarArea = () => {
    if (!file) {
      return (
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '1px dashed #d9d9d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa',
            transition: 'border-color 0.3s',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <CameraOutlined style={{ fontSize: 32, color: '#8c8c8c' }} />
        </div>
      );
    }

    const { status, url, percent } = file;

    if (status === 'uploading') {
      return (
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #d9d9d9',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <CameraOutlined style={{ fontSize: 32, color: '#bfbfbf', marginBottom: 8 }} />
          <div style={{ width: '80%', marginBottom: 6 }}>
            <Progress percent={percent || 0} size="small" status="active" showInfo={false} />
          </div>
          <span style={{ fontSize: 12, color: '#8c8c8c' }}>Uploading...</span>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div
          style={{
            width: 120,
            height: 120,
            border: '1px solid #ff4d4f',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            boxSizing: 'border-box',
            boxShadow: '0 2px 6px rgba(255,0,0,0.2)',
          }}
        >
          <CameraOutlined style={{ fontSize: 32, color: '#ff4d4f', marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: '#ff4d4f', textAlign: 'center' }}>Lỗi tải</div>
        </div>
      );
    }

    // ✅ Success + Preview có zoom/rotate
    return (
      <>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            border: '2px solid #e6f7ff',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          <img src={url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.4)',
              opacity: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
          >
            <EyeOutlined onClick={() => setPreviewVisible(true)} style={{ color: '#fff', fontSize: 20, cursor: 'pointer' }} />
            <Popconfirm title="Sure to delete?" onConfirm={handleRemove}>
              <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 20, cursor: 'pointer' }} />
            </Popconfirm>
          </div>
        </div>

        {/* Ant Design Image preview group (zoom/rotate) */}
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible: previewVisible,
              onVisibleChange: (vis) => setPreviewVisible(vis),
            }}
          >
            <Image src={url} alt="avatar" />
          </Image.PreviewGroup>
        </div>
      </>
    );
  };

  return (
    <Space direction="vertical" align='center'>
      <Space size={12}>
        {renderAvatarArea()}
        <Space direction="vertical" size={12}>
          <h3>Avatar</h3>
          <p style={{margin: 0, fontSize: 12}}>Min 400x400px, accept/*</p>
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={handleUpload}
            disabled={internalUploading}
            fileList={file ? [file] : []}
            onRemove={handleRemove}
          >
            <Button icon={<CloudUploadOutlined />} color="primary" variant="filled" loading={internalUploading}>
              Select
            </Button>
          </Upload>
        </Space>
      </Space>
    </Space>
  );
};

export default UploadAvatar;

