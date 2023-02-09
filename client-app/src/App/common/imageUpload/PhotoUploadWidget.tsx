import React, { useEffect, useState } from 'react'
import { Button, Grid, Header, Image } from 'semantic-ui-react'
import PhotoWidgetCropper from './PhotoWidgetCropper'
import PhotoWidgetDropzone from './PhotoWidgetDropzone'

interface Props {
  uploadPhoto:(file: Blob) => void
  loading: boolean
}

function PhotoUploadWidget({uploadPhoto, loading}: Props) {
  const [files, setFiles] = useState<any>([])
  const [cropper, setCropper] = useState<Cropper>()

  function onCrop() {
    if(cropper) {
      cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!))
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview))
    }
  }, [files])
  

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header color='teal' content='step 1 - add photo' />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color='teal' content='step 2 - resize image' />
        {files && files.length > 0 && (
          <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color='teal' content='step 3 - preview and upload' />
        {files && files.length > 0 &&
        <>
        <div className='img-preview' style={{minHeight: 200, overflow: 'hidden'}} />
        <Button.Group widths={2}>
          <Button loading={loading} onClick={onCrop} positive icon='check' />
          <Button disabled={loading} onClick={() => setFiles} icon='close' />
        </Button.Group>
        </>}
      </Grid.Column>
    </Grid>
  )
}

export default PhotoUploadWidget