from pydub import AudioSegment
import sys
from scipy.io import wavfile
import numpy as np

scale = 1.5
sound = AudioSegment.from_mp3("./resources/" + sys.argv[1])
sound.export("temp.wav", format="wav")
sample_rate, data = wavfile.read('temp.wav')
wavfile.write("temp.wav", int(sample_rate*scale),data)
AudioSegment.from_wav("temp.wav").export("./resources/" + '.'.join(sys.argv[1].split('.')[:-1]) + '_processed.mp3', format='mp3')
