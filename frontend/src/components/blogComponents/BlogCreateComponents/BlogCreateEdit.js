import { useEffect, useRef, useState } from "react";

function BlogCreateEdit({ data }) {

    const [title, setTitle] = data[0];
    const [thumbnail, setThumbnail] = data[1];
    const [content, setContent] = data[2];
    const [preview, setPreview] = useState();

    const textareaRefs = useRef([]);

    // Add/ Remove sections
    function updateSections(newSec, index = -1) {
        function inc() {
            setContent(prev => [...prev, {
                heading: '',
                text: ''
            }])
        }
        function dec() {
            setContent(prev => prev.filter((_, i) => i !== index))
        }
        if (newSec) inc();
        else dec();
    }

    function editSection(id, heading, text) {
        setContent(prev => {
            const newContent = [...prev]
            if (heading || heading === '') newContent[id].heading = heading
            if (text || text === '') newContent[id].text = text
            return newContent;
        })
    }

    // Auto resize content field 
    function handleResizeContent(id) {
        const textarea = textareaRefs.current[id]; 
        if (textarea) textarea.style.height = `${textarea.scrollHeight}px`;
    }

    // Cleanup 
    useEffect(() => {
        return () => {
            preview && URL.revokeObjectURL(preview)
        }
    }, [preview])

    function handleThumbnail(e) {
        const file = e.target.files[0];
        setPreview(file && URL.createObjectURL(file));
        setThumbnail(file || undefined);
    }

    return (
        <div className="col-md-8">
            <h1>New blog - Draft</h1>
            <form className="mb-3">
                <div>
                    <label htmlFor="title" className="form-label"></label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Title"
                        className="form-control fs-3"
                        id="title"
                    />
                </div>
                <div className="input-group my-3">
                    <input
                        type="file"
                        onChange={handleThumbnail}
                        className="form-control"
                        id="thumbnail"
                    />
                    <label htmlFor="thumbnail" className="input-group-text">Thumbnail</label>
                </div>
                {thumbnail && (<div>
                    <img src={preview} alt='preview' className="img-fluid" />
                </div>)}
                <div id="sections">
                    {content ? content.map((section, index) => <div key={index} className="position-relative pt-4">
                        <div className="mb-2">
                            <input
                                value={section.heading}
                                placeholder={`${index + 1}. Heading`}
                                className="form-control"
                                onChange={e => editSection(index, e.target.value, null)}
                            />
                        </div>
                        <div className="form-floating">
                            <textarea
                                ref={e => textareaRefs.current[index] = e}
                                value={section.text}
                                className="form-control mb-4"
                                placeholder="Leave a comment here"
                                onChange={e => editSection(index, null, e.target.value)}
                                onInput={() => handleResizeContent(index)}
                                style={{ overflow: 'hidden' }}
                            ></textarea>
                            <label>Content</label>
                        </div>
                        <button
                            type="button" className="btn-close position-absolute top-0 end-0"
                            aria-label="Close"
                            onClick={() => updateSections(false, index)}
                        ></button>
                    </div>) : 'Please add new section to edit'}
                </div>
            </form>
            <button type="button" className="btn btn-primary" onClick={() => updateSections(true)}>Add section</button>
        </div>
    )
}

export default BlogCreateEdit; 