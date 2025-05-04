import React, { useState } from 'react';
import { message, Upload, Button, Space, Layout, Typography, Spin, Card } from 'antd';
import { InboxOutlined, UploadOutlined, FileImageOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const props = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = ['.jpg', '.jpeg', '.png', '.bmp', '.webp'].some(ext =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isImage) {
        setFile(null);
        setImagePreview(null);
        message.error('Only image files (.jpg, .jpeg, .png, .bmp, .webp) are allowed!');
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      return false;
    },
    onDrop(e) {
      console.log('📦 Dropped files:', e.dataTransfer.files);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = res.data;
      const url = window.URL.createObjectURL(blob);

      setPdfUrl(url);
      setLoading(false);
      message.success('Conversion successful!');
    } catch (err) {
      console.error('Upload error:', err);
      message.error('An error occurred while processing the image');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'document.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Download started!');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: 'linear-gradient(to right, #1890ff, #096dd9)', 
        padding: '0 50px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FileImageOutlined style={{ color: 'white', fontSize: '24px', marginRight: '10px' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>Image to PDF Converter</Title>
        </div>
      </Header>

      <Content style={{ padding: '50px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  Upload your image
                </Title>
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '20px' }}>
                  Supported formats: JPG, JPEG, PNG, BMP, WEBP
                </Text>
              </div>

              <Dragger {...props} style={{ 
                background: '#f9f9f9', 
                border: '2px dashed #d9d9d9',
                borderRadius: '12px',
                padding: '30px 20px'
              }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '18px', fontWeight: 500 }}>
                  Click or drag image here to upload
                </p>
                <p className="ant-upload-hint">
                  Only one image file at a time is allowed
                </p>
              </Dragger>

              {imagePreview && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <Card
                    title="Selected Image"
                    style={{ borderRadius: '8px' }}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px',
                        borderRadius: '4px'
                      }} 
                    />
                    <div style={{ marginTop: '12px' }}>
                      <Text type="secondary">{file?.name}</Text>
                    </div>
                  </Card>
                </div>
              )}

              {file && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <Button 
                    type="primary" 
                    icon={<UploadOutlined />}
                    onClick={handleUpload} 
                    loading={loading}
                    size="large"
                    style={{
                      borderRadius: '8px',
                      padding: '0 40px',
                      height: '45px',
                      fontSize: '16px',
                      fontWeight: '600',
                      background: '#1890ff',
                      boxShadow: '0 2px 8px rgba(24,144,255,0.5)'
                    }}
                  >
                    {loading ? 'Processing...' : 'Convert to PDF'}
                  </Button>
                </div>
              )}

              {loading && (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <Spin size="large" />
                  <Text style={{ display: 'block', marginTop: '15px' }}>
                    Processing your image...
                  </Text>
                </div>
              )}

              {pdfUrl && !loading && (
                <div style={{ marginTop: '30px' }}>
                  <Card
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>PDF Preview</span>
                        <Button 
                          type="primary" 
                          icon={<DownloadOutlined />} 
                          onClick={handleDownload}
                          style={{
                            borderRadius: '6px',
                            background: '#52c41a',
                            border: 'none'
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    }
                    style={{ 
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    <iframe 
                      src={pdfUrl} 
                      style={{ 
                        width: '100%', 
                        height: '600px',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                      title="PDF Preview"
                    />
                  </Card>
                </div>
              )}
            </Space>
          </Card>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)', padding: '20px 50px' }}>
        <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
          Image to PDF Converter &copy; {new Date().getFullYear()}
        </Text>
      </Footer>
    </Layout>
  );
}
