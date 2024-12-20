import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext, ToastContext, BackendContext } from "../../../App";

function BlogCreateOption({ data }) {

    const backendLink = useContext(BackendContext);

    const pageNavigate = useNavigate();
    const [title, thumbnail, content] = data;
    const [tags, setTags] = useState('');
    const currentUser = useContext(UserContext);
    const currentUserId = currentUser ? currentUser[0]._id : ``;
    const handleToast = useContext(ToastContext);
    const [disable, setDisable] = useState(false);

    async function saveDraft() {
        const arrTags = tags.trim().split(',').map(tag => tag.trim()).filter(e => e);
        const arrContent = content.filter(e => e.heading);

        const newBlog = {
            title: title,
            thumbnail: thumbnail,
            content: arrContent,
            author: currentUserId,
            tags: arrTags,
            comments: [],
            published: false,
            deleted: false
        }

        setDisable(true);

        if (thumbnail) {

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

            const fileType = thumbnail.type;
            const fileExtension = thumbnail.name.split('.').pop().toLowerCase();

            if (!allowedTypes.includes(fileType) && !allowedExtensions.includes(fileExtension)) {
                handleToast('error', 'Image required', 'Please choose an image file (png, jpg or gif)'); 
                setDisable(false);
                return;
            }

            try {
                const formData = new FormData();
                formData.append('file', thumbnail);
                formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

                const response = fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                })

                if (typeof response.json === 'function' && !response.json().secure_url && !response.ok)
                    throw new Error('Fail to send your local image');

                const res = await response;
                const data = await res.json();

                if (data.errors) throw new Error(data.message || 'An error occured');
                if (!data.secure_url) handleToast(
                    'warn',
                    'fail to upload image',
                    `The error maybe due to running out of free photo storage, therefore the blog will be saved as no thumbnail`
                );

                newBlog.thumbnail = data.secure_url;
            } catch (error) {
                handleToast('error', 'failed', `${error}`);
                setDisable(false);
            }
        } else newBlog.thumbnail = '';

        fetch(`${backendLink}/blog`, {
            method: 'POST',
            body: JSON.stringify(newBlog),
            headers: { "Content-Type": "application/json" },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.errors) throw new Error(data.message || 'An error occured')
                if (data._id) pageNavigate(`/blog/${data._id}`)
                else setDisable(false)
                handleToast('check', 'succeed', `Your blog saved`);
            })
            .catch(err => {
                console.log(err);
                handleToast('error', 'failed', `${err}`);
                setDisable(false);
            })

    }

    return (
        <div className="col-md-4">
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-light">
                <h2 className="mb-3 mb-md-0 link-dark fs-4 text-center">Editor sidebar</h2>
                <hr />
                <div className="input-group mb-3">
                    <span className="input-group-text">Tags</span>
                    <input
                        className="form-control"
                        placeholder="seperate, tags, by, commas"
                        onChange={e => setTags(e.target.value)}
                        value={tags}
                    />
                </div>
                <hr />
                <div className="d-flex flex-column gap-1">
                    <Link to='/blog'>
                        <button
                            type="button"
                            className="btn btn-danger w-100 text-center"
                            disabled={disable}
                        >Delete draft</button>
                    </Link>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => saveDraft()}
                        disabled={disable}
                    >Save draft</button>
                    {/* <button type="button" className="btn btn-success">Publish</button> */}
                </div>
            </div>
        </div>
    )
}

export default BlogCreateOption; 
