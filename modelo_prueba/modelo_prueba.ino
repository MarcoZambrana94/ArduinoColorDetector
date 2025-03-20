#define S0 4
#define S1 5
#define S2 6
#define S3 7
#define sensorOut 8

void setup() {
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(sensorOut, INPUT);

  digitalWrite(S0, HIGH); // 20% de frecuencia
  digitalWrite(S1, LOW);

  Serial.begin(9600);
}

int mapColor(int freq, int fmin, int fmax) {
  if ((255 - map(freq, fmin, fmax, 0, 255)) >= 0){
    return 255 - map(freq, fmin, fmax, 0, 255);
  }
  else {
    return 0;
  }
}

void loop() {
  int fR, fG, fB;
  
  // Leer Rojo
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  fR = pulseIn(sensorOut, LOW);

  // Leer Verde
  digitalWrite(S2, HIGH);
  digitalWrite(S3, LOW);
  fG = pulseIn(sensorOut, LOW);

  // Leer Azul
  digitalWrite(S2, LOW);
  digitalWrite(S3, HIGH);
  fB = pulseIn(sensorOut, LOW);

  // Convertir a RGB (Valores de referencia negro: 10 Hz, blanco: 200 Hz)
  int R = mapColor(fR, 36, 381);
  int G = mapColor(fG, 13, 129);
  int B = mapColor(fB, 34, 340);

  Serial.print("{\"r\":");
  Serial.print(R);
  Serial.print(",\"g\":");
  Serial.print(G);
  Serial.print(",\"b\":");
  Serial.print(B);
  Serial.println("}");

  delay(1000);
}
