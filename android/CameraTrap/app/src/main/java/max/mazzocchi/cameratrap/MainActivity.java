package max.mazzocchi.cameratrap;

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
        } else {
            Log.i(TAG, "Not available.");
        }
    }
}
