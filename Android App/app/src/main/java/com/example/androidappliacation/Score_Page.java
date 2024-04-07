package com.example.androidappliacation;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.color.utilities.Score;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class Score_Page extends AppCompatActivity {

    TextView scoreCorrect, scoreTotal;
    Button playAgain, exit;

    String userCorrect;
    String userWrong;

    FirebaseDatabase database = FirebaseDatabase.getInstance();
    DatabaseReference databaseReference = database.getReference().child("scores");

    FirebaseAuth auth = FirebaseAuth.getInstance();
    FirebaseUser user = auth.getCurrentUser();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_score_page);

        scoreCorrect = findViewById(R.id.textViewAnswerCorrect);
        scoreTotal = findViewById(R.id.textViewAnswerTotal);
        playAgain = findViewById(R.id.buttonPlayAgain);
        exit = findViewById(R.id.buttonExit);

        databaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {

                int userTotal = 0;

                String userUID = user.getUid();
                userCorrect = snapshot.child(userUID).child("correct").getValue().toString();
                userWrong = snapshot.child(userUID).child("wrong").getValue().toString();
                userTotal = Integer.parseInt(userWrong) + Integer.parseInt(userCorrect);

                scoreCorrect.setText("" + userCorrect);
                scoreTotal.setText("" + userTotal);

                if(Integer.parseInt(userCorrect)> userTotal / 2)
                {
                    scoreCorrect.setTextColor(Color.parseColor("#174d25"));
                    Toast.makeText(Score_Page.this,"Good job! You've done well"
                            ,Toast.LENGTH_SHORT).show();
                }
                else
                {
                    scoreCorrect.setTextColor(Color.parseColor("#de2316"));
                    Toast.makeText(Score_Page.this,"Do better"
                            ,Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });

        playAgain.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent i = new Intent(Score_Page.this, MainActivity.class);
                startActivity(i);
                finish();

            }
        });

        exit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                finish();

            }
        });

    }
}