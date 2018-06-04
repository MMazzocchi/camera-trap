package max.mazzocchi.cameratrap;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.Image;
import android.media.ImageReader;
import android.os.Handler;
import android.os.HandlerThread;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.util.Size;
import android.view.Surface;
import android.view.TextureView;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "CameraTrap";

    private TextureView preview_view;
    private HandlerThread image_handler_thread;
    private Handler image_handler;

    @Override
    protected void onCreate(Bundle savedInstanceState)  {
        super.onCreate(savedInstanceState);
        Log.i(TAG, "onCreate");
        setContentView(R.layout.activity_main);

        preview_view = this.findViewById(R.id.camera_preview);
        image_handler_thread = new HandlerThread("ImageHandler");
        image_handler_thread.start();
        image_handler = new Handler(image_handler_thread.getLooper());

        Log.i(TAG, "onCreate finished");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        Log.i(TAG, "onDestroy");

        image_handler_thread.quitSafely();
        try {
            image_handler_thread.join();
        } catch(InterruptedException ie) {
            Log.e(TAG, "Image handler thread was interrupted while joining.", ie);
        }

        Log.i(TAG, "onDestroy complete");
    }

    @Override
    public void onPause() {
        super.onPause();
        Log.i(TAG, "onPause");
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.i(TAG, "onResume");

        if(preview_view.isAvailable()) {
            openCamera(preview_view.getWidth(), preview_view.getHeight());

        } else {
            preview_view.setSurfaceTextureListener(
                    new PreviewTextureListener());
        }
    }

    private CameraCharacteristics getCameraCharacteristics(
            CameraManager manager) throws CannotAccessCameraException {
        try {
            CameraCharacteristics out = null;

            for (String camera_id : manager.getCameraIdList()) {
                CameraCharacteristics characteristics =
                        manager.getCameraCharacteristics(camera_id);
                Integer facing = characteristics.get(
                        CameraCharacteristics.LENS_FACING);
                if((facing == null) ||
                        (facing == CameraCharacteristics.LENS_FACING_FRONT)) {
                    StreamConfigurationMap map = characteristics.get(
                            CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
                    if(map != null) {
                        out = characteristics;
                        break;
                    }
                }
            }

            if(out != null) {
                return out;

            } else {
                throw new CannotAccessCameraException(
                        "No suitable camera could be found.");
            }
        } catch(NullPointerException npe) {
            throw new CannotAccessCameraException(npe);
        } catch(CameraAccessException cae) {
            throw new CannotAccessCameraException(cae);
        }
    }

    private void openCamera(int width, int height) {
        if(permissionsGranted()) {
            Log.i(TAG, "We have permissions.");
            CameraManager manager =
                    (CameraManager) getSystemService(Context.CAMERA_SERVICE);

            try {
                CameraCharacteristics characteristics =
                        getCameraCharacteristics(manager);
                StreamConfigurationMap map = characteristics.get(
                        CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
                Size largest = Collections.max(
                        Arrays.asList(map.getOutputSizes(ImageFormat.JPEG)),
                        new SizeComparator());
                ImageReader reader = ImageReader.newInstance(
                        largest.getWidth(), largest.getHeight(),
                        ImageFormat.JPEG,
                        2);
                reader.setOnImageAvailableListener(new ImageAvailableListener(),
                        image_handler);
                int display_rotation = this.getWindowManager()
                        .getDefaultDisplay()
                        .getRotation();
                int sensor_orientation = characteristics.get(
                        CameraCharacteristics.SENSOR_ORIENTATION);
                boolean swapped_dims = false;
                switch(display_rotation) {
                    case Surface.ROTATION_0:
                    case Surface.ROTATION_180:
                        if(sensor_orientation == 90 ||
                                sensor_orientation == 270) {
                            swapped_dims = true;
                        }
                        break;

                    case Surface.ROTATION_90:
                    case Surface.ROTATION_270:
                        if(sensor_orientation == 0 ||
                                sensor_orientation == 180) {
                            swapped_dims = true;
                        }
                        break;

                    default:
                        Log.w(TAG, "Display rotation is invalid: "+
                                display_rotation);
                }

            } catch(CannotAccessCameraException |
                    NullPointerException e) {
                Log.e(TAG, "Could not access camera: {0}", e);
            }

        } else {
            // TODO: Display some sort of message
            Log.i(TAG, "We don't have permissions.");
        }
    }

    private boolean permissionsGranted() {
        return (ContextCompat.checkSelfPermission(
                getApplicationContext(), Manifest.permission.CAMERA) ==
                PackageManager.PERMISSION_GRANTED);
    }

    private class PreviewTextureListener
            implements TextureView.SurfaceTextureListener {
        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture texture,
                                              int width, int height) {
            Log.i(TAG, "Texture available");
            openCamera(width, height);
        }

        @Override
        public void onSurfaceTextureSizeChanged(SurfaceTexture texture,
                                                int width, int height) {
            Log.i(TAG, "Texture changed");
        }

        @Override
        public boolean onSurfaceTextureDestroyed(SurfaceTexture texture) {
            Log.i(TAG, "Texture destroyed");
            return true;
        }

        @Override
        public void onSurfaceTextureUpdated(SurfaceTexture texture) {
            Log.i(TAG, "Texture updated");
        }
    }

    private static class CannotAccessCameraException extends Exception {
        public CannotAccessCameraException(Throwable e) {
            super(e);
        }

        public CannotAccessCameraException(String reason) {
            super(reason);
        }
    }

    private static class SizeComparator implements Comparator<Size> {
        @Override
        public int compare(Size a, Size b) {
            return Long.signum(
                    (long) a.getWidth() * a.getHeight() -
                    (long) b.getWidth() * b.getHeight());
        }
    }

    private static class ImageAvailableListener
            implements ImageReader.OnImageAvailableListener {

        @Override
        public void onImageAvailable(ImageReader reader) {
            Image image = reader.acquireNextImage();
            // TODO: Send the image off
        }
    }
}
