package max.mazzocchi.cameratrap;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraManager;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.TextureView;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "CameraTrap";

    private TextureView preview_view;

    @Override
    protected void onCreate(Bundle savedInstanceState)  {
        super.onCreate(savedInstanceState);
        Log.i(TAG, "onCreate");
        setContentView(R.layout.activity_main);

        preview_view = this.findViewById(R.id.camera_preview);

        Log.i(TAG, "onCreate finished");
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
            Log.i(TAG, "Available!");
            openCamera(preview_view.getWidth(), preview_view.getHeight());
        } else {
            preview_view.setSurfaceTextureListener(new PreviewTextureListener());
        }
    }

    private void openCamera(int width, int height) {
        if(permissionsGranted()) {
            Log.i(TAG, "We have permissions.");
            CameraManager manager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);

        } else {
            // TODO: Display some sort of message
            Log.i(TAG, "We don't have permissions.");
        }
    }

    private boolean permissionsGranted() {
        return (ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.CAMERA) ==
                PackageManager.PERMISSION_GRANTED);
    }

    private class PreviewTextureListener implements TextureView.SurfaceTextureListener {
        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture texture, int width, int height) {
            Log.i(TAG, "Texture available");
            Log.i(TAG, "Width: "+width);
            Log.i(TAG, "Height: "+height);

            openCamera(width, height);
        }
        @Override
        public void onSurfaceTextureSizeChanged(SurfaceTexture texture, int width, int height) {
            Log.i(TAG, "Texture changed");
            Log.i(TAG, "Width: "+width);
            Log.i(TAG, "Height: "+height);
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
}
