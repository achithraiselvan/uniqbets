import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Card = ({ game, teamA, teamB, time, bet }) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const endTime = moment(time, 'YYYY-MM-DD hh:mm:ssa');

      if (!now.isValid() || !endTime.isValid()) {
        clearInterval(interval);
        setCountdown('Invalid Date');
        return;
      }

      if (endTime.isBefore(now)) {
        clearInterval(interval);
        setCountdown('Game Ended');
      } else {
        const duration = moment.duration(endTime.diff(now));
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        let countdownString = '';

        if (days > 0) {
          countdownString += `${days}d `;
        }

        countdownString += `${hours}h ${minutes}m ${seconds}s`;

        setCountdown(countdownString);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const teamALength = teamA.length;
  const teamBLength = teamB.length;
  const maxLength = Math.max(teamALength, teamBLength);
  const diff = Math.abs(teamALength - teamBLength);
  const emptySpace = Array(diff).fill(' ').join('');

  const formattedTeamA = teamALength < maxLength ? `${teamA}${emptySpace}` : teamA;
  const formattedTeamB = teamBLength < maxLength ? `${emptySpace}${teamB}` : teamB;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.gameText}>{game}</Text>
        <View style={styles.teamContainer}>
          <View style={styles.teamAContainer}>
            <Text style={styles.teamText}>{formattedTeamA}</Text>
          </View>
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.teamBContainer}>
            <Text style={styles.teamText}>{formattedTeamB}</Text>
          </View>
        </View>
        {countdown !== 'Game Ended' ? (
          <View style={styles.countdownContainer}>
            <View style={styles.clockIconContainer}>
              <Icon name="clock-outline" size={18} color="#EE4B2B" />
            </View>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        ) : (
          <Text style={styles.gameEndedText}>Game Ended</Text>
        )}
        <View style={styles.line}></View>
      </View>
      {bet.map((item, index) => {
        const { bet_value, odds, status } = item;
        let formattedStatus = status.toUpperCase();

        if (formattedStatus === 'UPCOMING') {
          formattedStatus = 'COMING SOON';
        }

        let statusIcon = null;

        if (formattedStatus === 'WON') {
          statusIcon = <Icon name="check-circle" size={18} color="green" />;
        } else if (formattedStatus === 'LOST') {
          statusIcon = <Icon name="close-circle" size={18} color="red" />;
        } else if (formattedStatus === 'LIVE') {
          statusIcon = <Icon name="live" size={18} color="blue" />;
        } else if (formattedStatus === 'COMING SOON') {
          statusIcon = <Icon name="calendar" size={18} color="purple" />;
        }

        return (
          <View key={index} style={styles.betContainer}>
            <View style={styles.betDetailsContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.labelText}>Bet Value:</Text>
                <Text style={styles.valueText}>{bet_value}</Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.labelText}>Odds:</Text>
                <Text style={styles.valueText}>{odds}</Text>
              </View>
            </View>
            <View style={styles.iconContainer}>{statusIcon}</View>
          </View>
        );
      })}
    </View>
  );
};

const PredictionCard = ({ prediction }) => {
  return (
    <>
      {prediction.map((item, index) => (
        <Card
          key={index}
          game={item.game}
          teamA={item.teamA}
          teamB={item.teamB}
          time={item.time}
          bet={item.bet}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#D9D9D9',
    padding: 16,
    marginBottom: 16,
  },
  gameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6D6D6D',
    textAlign: 'center',
  },
  teamText: {
    fontSize: 16,
    marginBottom: 8,
  },
  betContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  clockIconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EE4B2B',
    textAlign: 'center',
  },
  gameEndedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 8,
  },
  betDetailsContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  labelText: {
    color: '#6D6D6D',
    marginRight: 4,
  },
  valueText: {
    color: 'black',
  },
  iconContainer: {
    width: '10%',
    marginRight: 4,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamAContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  teamBContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  vsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PredictionCard;
