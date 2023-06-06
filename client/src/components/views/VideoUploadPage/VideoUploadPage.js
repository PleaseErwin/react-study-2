import React, { useState } from "react";
import { Form, Icon, Input, Button, message, Typography } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from "axios";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"}
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);// public = 1
    const [Category, setCategory] = useState(0);

    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    }

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'mutipart/form-data'}
        }
        formData.append("file", files[0]);

        Axios.post('/api/video/uploads', formData, config)// 서버에 request를 보냄
            .then(response => {
                if (response.data.success) {
                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url);

                    Axios.post('/api/video/thumbnail', variable)
                    .then(response => {
                        if (response.data.success) {
                            setDuration(response.data.fileDuration);
                            setThumbnailPath(response.data.url);
                        } else {
                            alert('Failed to make thumbnail of video');
                        }
                    })
                } else {
                    alert('Failed to upload video');
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }
        Axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if (response.data.success) {
                message.success('video uploaded!');
                setTimeout(() => {
                    props.history.push('/');
                }, 3000);
            } else {
                alert('Failed to upload video')
            }
        })
    }

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={100000000}>
                        {({ getRootProps, getInputProps}) => (
                        <div style={{ width:'300px', height:'240px', border:'1px solid lightgray',
                        display:'flex', justifyContent:'center', alignItems:'center' }} {...getRootProps()}>
                            <input {...getInputProps()}/>
                            <Icon type="plus" style={{fontSize:"3rem"}}/>
                        </div>
                        )}
                    </Dropzone>
                    { ThumbnailPath &&// ThumbnailPath가 있을 때만 썸네일 이미지 렌더링
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage;